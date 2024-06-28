import request from '@/utils/request'

// 查询产品列表
export function getProductList(query) {
  return request({
    url: '/product/list',
    method: 'get',
    params: query
  })
}

// 添加产品信息
export function addProduct(data) {
  return request({
    url: '/product/add',
    method: 'post',
    data: data
  })
}

// 修改产品信息
export function updateProduct(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data: data
  })
}

// 删除产品信息
export function delProduct(id) {
  return request({
    url: '/product/delete/' + id,
    method: 'delete'
  })
}

// 导入产品代码excel
export async function uploadProductExcel(formData) {
  return request({
    url: '/file/importProductExcel',
    method: 'post',
    data: formData
  })
}