"use strict";

let db = require('./database');

let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

// Find entries to show in main table
let findAll = async (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  values = [];
  let sql = ['SELECT fo.URI as uri, fo.hash_md5 as hash, dp."dataProductType" as type, ',
            'dp."dataProductIdentifier" as productid, ',
            'dp."processIdentifier" as processid ',
            'FROM AWOPER."DataProduct+" dp, ',
            'AWOPER.FileObject fo, ',
            'AWOPER."Process+" pr ',
            'WHERE dp."processIdentifier" = pr."processIdentifier" ',
            'AND fo.data_object = dp."object_id" ',
            'AND dp."isValid" > 0 ',
            'AND ROWNUM <= 50'].join('\n');
      //db2.initialize();
      await db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

// Find information for specific product id
let findByProdId = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  whereParts = [],
  values = [];
  let prod_id = req.params.prod_id;
  let sql = ['SELECT fo.URI as uri, fo.hash_md5 as hash, dp."dataProductType" as type, ',
            'dp."dataProductIdentifier" as productid, ',
            'dp."processIdentifier" as processid ',
            'FROM AWOPER."DataProduct+" dp, ',
            'AWOPER.FileObject fo, ',
            'AWOPER."Process+" pr ',
            'WHERE dp."processIdentifier" = pr."processIdentifier" ',
            'AND fo.data_object = dp."object_id" ',
            'AND dp."isValid" > 0 ',
            'AND dp."dataProductIdentifier" = ' + prod_id].join('\n');
    db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

exports.findAll = findAll;
exports.findByProdId = findByProdId;
