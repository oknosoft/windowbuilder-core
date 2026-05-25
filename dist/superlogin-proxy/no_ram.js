
const page = {
  docs_written: 0,
  page: 0,
  start: Date.now(),
  manifest: [],
  add(arr) {
    this.manifest.push.apply(this.manifest, arr);
  },
  get total_rows() {
    let v = 0;
    for(const el of this.manifest) {
      const key = Object.keys(el)[0];
      v += el[key];
    }
    return v;
  }
};

function load_fin(pouch) {
  const {props} = pouch;
  return Promise.resolve()
    .then(() => {
      props._data_loaded = true;
      pouch.emit('pouch_data_loaded');
    })
    .then(() => {
      props._doc_ram_loading = true;
      pouch.emit('pouch_doc_ram_start');
    })
    .then(() => {
      props._doc_ram_loading = false;
      props._doc_ram_loaded = true;
      pouch.emit('pouch_doc_ram_loaded');
    });
}

export function load_ram({adapters: {pouch}, md}, types) {
  const {props} = pouch;
  const headers = new Headers();
  if(types) {
    headers.set('types', types.join(','));
  }
  const zone = sessionStorage.getItem('zone') || props.zone;
  return pouch.fetch(`/couchdb/mdm/${zone}/${props._suffix}`, {headers})
    .then(stream_load(md, pouch))
    .then(() => load_fin(pouch));
}

export async function load_ram_splitted({adapters: {pouch}, md}) {
  const {props} = pouch;
  const zone = sessionStorage.getItem('zone') || props.zone;
  const load_order = md.order();
  const {common, manifest} = md.order;
  const load_part = stream_load(md, pouch, true);
  pouch.emit('pouch_load_start', page)
  for(const names of load_order) {
    for(const name of names) {
      if(!common.includes(name)) {
        const meta = md.get(name);
        if(meta?.cachable === 'ram' && !meta.deferred && !meta.joint) {
          // выполняем запрос
          await pouch.fetch(`/couchdb/mdm/${zone}/${props._suffix}?type=${name}`).then(load_part);
        }
      }
    }
  }
  load_fin(pouch);
}

// загружает данные, которые не зависят от отдела абонента
export function load_common({adapters: {pouch}, md, msg}, types) {
  const headers = new Headers();
  if(types) {
    headers.set('types', types.join(','));
  }
  const zone = sessionStorage.getItem('zone') || pouch.props.zone;
  return pouch.fetch(`/couchdb/mdm/${zone}/common`, {headers})
    .then(stream_load(md, pouch))
    .then(() => pouch.emit('common_loaded'))
    .catch((err) => {
      pouch.emit('user_log_fault', {message: 'custom', text: err.message.includes('406') ? err.message : msg.error_proxy});
      return err;
    })
    .then((err) => {
      pouch.emit('pouch_no_data', 'no_ram');
      if(err instanceof Error) {
        throw err;
      }
    });
}

function stream_load(md, pouch, splitted) {

  function load(part) {
    const data = JSON.parse(part);
    const mgr = md.mgr_by_class_name(data.name);
    mgr && mgr.load_array(data.rows, true);
    page.docs_written += data.rows.length;
    page.page++;
    pouch.emit('pouch_data_page', page);
  }

  return async function stream_load(res) {
    const {body, headers, status, statusText} = res;

    if(status > 200) {
      let descr;
      try {
        descr = await res.json();
      }
      catch (e) {}
      throw new Error(`${status}: ${descr?.message || statusText}`);
    }

    if(!splitted) {
      page.add(JSON.parse(headers.get('manifest')));
      page.page && pouch.emit('pouch_load_start', page); 
    }

    let chunks = '', tmp;

    const fin = (text) => {
      const parts = text.split('\r\n');
      if(!text.endsWith('\r\n')) {
        if(chunks.length) {
          chunks += parts.shift();
          if(parts.length) {
            load(chunks);
            chunks = '';
          }
        }
        if(parts.length) {
          chunks = parts.pop();
        }
      }
      else if(chunks.length) {
        chunks += parts.shift();
        if(parts.length) {
          load(chunks);
          chunks = '';
        }
      }

      for(const part of parts) {
        part && load(part);
      }
    };

    if (typeof TextDecoderStream === 'function') {
      const stream = body.pipeThrough(new TextDecoderStream('utf-8', {fatal: true}));
      const reader = stream.getReader();

      for(;;) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        fin(value);
      }
    }
    else {
      const reader = body.getReader();
      const decoder = new TextDecoder("utf-8", {fatal: true});

      for(;;) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        let text;
        if(tmp) {
          tmp = new Uint8Array([...tmp, ...value]);
          try {
            text = decoder.decode(tmp);
            tmp = null;
          }
          catch (e) {
            continue;
          }
        }
        else {
          try {
            text = decoder.decode(value);
            //text.includes('\ufffd')
          }
          catch (e) {
            tmp = value;
            continue;
          }
        }

        fin(text);
      }
    }


  };
}
