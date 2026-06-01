const database = require('./exz.json');

exports.handler = function(event, context) {
  // ترويسات الاستجابة لدعم CORS وتحديد نوع المحتوى والترميز
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // السماح بطلبات GET فقط
  if (event.httpMethod !== 'GET') {
    return Promise.resolve({
      statusCode: 405,
      headers: headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    });
  }

  // الحصول على معرّف الطالب من متغيرات الاستعلام (Query Parameters)
  const queryParams = event.queryStringParameters || {};
  const id = queryParams.id;

  if (!id) {
    return Promise.resolve({
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({ error: 'الرجاء إدخال رقم الطالب للبحث' })
    });
  }

  const idValue = id.trim();

  // البحث في ملف البيانات عن تطابق تام لرقم الطالب
  const results = database.filter(function(item) {
    return item["رقم الطالب"] && item["رقم الطالب"].toString().trim() === idValue;
  });

  return Promise.resolve({
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(results)
  });
};
