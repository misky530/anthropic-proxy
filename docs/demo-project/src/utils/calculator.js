// 价格计算工具
// 被三个模块依赖，但从来没人写过测试

var TAX_RATE = 0.13

function calculateTotal(price, quantity) {
  console.log('calculating total...')
  // bug: quantity 为 0 时不报错，应该提示
  var subtotal = price * quantity
  return subtotal
}

function applyDiscount(total, discountPercent) {
  // bug: 没有校验 discount 范围，传入 150 会变成负数
  var discount = total * (discountPercent / 100)
  return total - discount
}

function calculateTax(amount) {
  // 没有处理负数金额
  return amount * TAX_RATE
}

function calculateFinalPrice(price, quantity, discountPercent) {
  var total = calculateTotal(price, quantity)
  var discounted = applyDiscount(total, discountPercent)
  var tax = calculateTax(discounted)
  console.log('final price calculated:', discounted + tax)
  return discounted + tax
}

function formatCurrency(amount) {
  // bug: 没有处理非数字输入
  return '$' + amount.toFixed(2)
}

module.exports = { calculateTotal, applyDiscount, calculateTax, calculateFinalPrice, formatCurrency }
