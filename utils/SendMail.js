const USDollar = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
});

exports.htmlContent = ({ customerInfo, products, totalPrice }) => {
  const price = USDollar.format(totalPrice) + " VND";
  content = `
  <html>

<body>
<h2>Xin chào ${customerInfo.fullName}</h2>
<p>Phone: ${customerInfo.phone}</p>
<p>Address: ${customerInfo.address}</p>
<table style="border:1px solid black;text-align: center;table-layout: auto">
	<tr>
    	<th style="border:1px solid black;text-align: center">Tên sản phẩm</th>
        <th style="border:1px solid black;text-align: center;width:15%">Hình ảnh</th>
        <th style="border:1px solid black;text-align: center">Giá</th>
        <th style="border:1px solid black;text-align: center">Số lượng</th>
        <th style="border:1px solid black;text-align: center">Thành tiền</th>
    </tr>`;

  products.forEach((item) => {
    content += `
    <tr>
    	<td style="border:1px solid black;text-align: center">${
        item.product.name
      }</td>
        <td style="border:1px solid black;text-align: center"><img style="width: 60%" src="https://asm3-be-1kfy.onrender.com/${
          item.product.img1
        }"/></td> 
        <td style="border:1px solid black;text-align: center">${
          USDollar.format(item.product.price) + " VND"
        } VND</td>
        <td style="border:1px solid black;text-align: center">${
          item.quantity
        }</td>
        <td style="border:1px solid black;text-align: center">${
          USDollar.format(item.product.price * item.quantity) + " VND"
        } VND</td>
    </tr>
        `;
  });

  content += `</table>
  <h3>Tổng thanh toán: ${price}</h3>
  <h3>Cảm ơn bạn!</h3>
    </body>
    </html>`;
  return content;
};
