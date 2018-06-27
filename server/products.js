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
  
  let sql = `SELECT
nr_subbands, u.observation ||'-'|| u.SUBARRAYPOINTING lid, p.DECLINATION, p.RIGHTASCENSION, o.STARTTIME, o.ENDTIME
FROM
(
SELECT
observation,
SUBARRAYPOINTING,
count(uri) AS nr_subbands
FROM
AWOPER.CorrelatedDataProduct p
JOIN awoper.FileObject fo ON fo.DATA_OBJECT = p.OBJECT_ID
GROUP BY observation, SUBARRAYPOINTING
) u
JOIN awoper.SubArrayPointing sp ON u.SUBARRAYPOINTING = sp.OBJECT_ID
JOIN awoper.Pointing p ON p.OBJECT_ID = sp.POINTING
JOIN awoper.observation o ON o.object_id = u.observation
`
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
  let sql = `
  SELECT
uri
FROM
AWOPER.CorrelatedDataProduct p
JOIN awoper.FileObject fo ON fo.DATA_OBJECT = p.OBJECT_ID
WHERE
observation=hextoraw('D548B55F0C2A01BCE043C616A9C30957')
AND
subarraypointing=hextoraw('D548B55F0C2901BCE043C616A9C30957')
`
/*
  ['SELECT fo.URI as uri, fo.hash_md5 as hash, dp."dataProductType" as type, ',
            'dp."dataProductIdentifier" as productid, ',
            'dp."processIdentifier" as processid ',
            'FROM AWOPER."DataProduct+" dp, ',
            'AWOPER.FileObject fo, ',
            'AWOPER."Process+" pr ',
            'WHERE dp."processIdentifier" = pr."processIdentifier" ',
            'AND fo.data_object = dp."object_id" ',
            'AND dp."isValid" > 0 ',
            'AND dp."dataProductIdentifier" = ' + prod_id].join('\n');
*/
    db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

exports.findAll = findAll;
exports.findByProdId = findByProdId;
