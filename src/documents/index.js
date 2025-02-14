
import {classes as calcOrderClasses, meta as calcOrder, exclude as calcOrderExclude} from './calcOrder';
import {classes as purchaseOrderClasses, meta as purchaseOrder, exclude as purchaseOrderExclude} from './purchaseOrder';

export const meta = {
  calcOrder,
  purchaseOrder,
};

export const exclude = [
  calcOrderExclude,
  purchaseOrderExclude,
];

export const classes = [
  calcOrderClasses,
  purchaseOrderClasses,
];
