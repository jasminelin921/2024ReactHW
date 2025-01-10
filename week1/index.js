function App() {
  const [tempProduct, setTempProduct] = React.useState(null);
  const [product, setProduct] = React.useState({}); // 存取指定產品資訊
  const [products, setProducts] = React.useState([
    {
      category: "甜甜圈",
      content: "尺寸：14x14cm",
      description:
        "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
      id: "-L9tH8jxVb2Ka_DYPwng",
      is_enabled: 1,
      origin_price: 150,
      price: 99,
      title: "草莓莓果夾心圈",
      unit: "個",
      num: 10,
      imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
      imagesUrl: [
        "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
        "https://images.unsplash.com/photo-1559656914-a30970c1affd",
      ],
    },
    {
      category: "蛋糕",
      content: "尺寸：6寸",
      description:
        "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
      id: "-McJ-VvcwfN1_Ye_NtVA",
      is_enabled: 1,
      origin_price: 1000,
      price: 900,
      title: "蜂蜜檸檬蛋糕",
      unit: "個",
      num: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
      imagesUrl: [
        "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
      ],
    },
    {
      category: "蛋糕",
      content: "尺寸：6寸",
      description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
      id: "-McJ-VyqaFlLzUMmpPpm",
      is_enabled: 1,
      origin_price: 700,
      price: 600,
      title: "暗黑千層",
      unit: "個",
      num: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
      imagesUrl: [
        "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
        "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
      ],
    },
  ]);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>產品列表</h2>
          <table className="table">
            <thead>
              <tr>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>查看細節</th>
              </tr>
            </thead>
            <tbody>
              {/* 產品列表 */}
              {products.map((item, index) => (
                <tr key={item.id}>
                  {/* 如果產品未啟用，產品名稱、原價、售價的顏色則顯示灰色 */}
                  <td className={item.is_enabled ? "" : "text-secondary"}>
                    {item.title}
                  </td>
                  <td className={item.is_enabled ? "" : "text-secondary"}>
                    <del>{item.origin_price}</del>
                  </td>
                  <td className={item.is_enabled ? "" : "text-secondary"}>
                    {item.price}
                  </td>
                  <td>
                    {/* 產品啟用按鈕 */}
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        // 當按鈕點擊時，去找尋集合中對應的產品，並更新其狀態為 enable
                        setProducts(
                          products.map((i, key) => {
                            if (key !== index) return i;
                            i.is_enabled = !i.is_enabled;
                            return i;
                          })
                        );
                        // 產品狀態為 disable 時，無法查看產品細節
                        if (!item.is_enabled) {
                          setTempProduct(false);
                        }
                      }}
                    >
                      {item.is_enabled ? "是" : "否"}
                    </button>
                  </td>
                  <td>
                    {item.is_enabled ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setProduct(item); // 取得對應的產品資料
                          setTempProduct(true);
                        }}
                      >
                        查看細節
                      </button>
                    ) : (
                      <button className="btn btn-primary disabled">
                        查看細節
                      </button>
                    )}
                    {/* 產品未啟用，按鈕無法點擊 disabled */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h2>單一產品細節</h2>
          {tempProduct ? (
            <div className="card mb-3">
              <img
                src={product.imageUrl}
                className="card-img-top primary-image"
                alt="主圖"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {product.title}
                  <span className="badge bg-primary ms-2">
                    {product.category}
                  </span>
                </h5>
                <p className="card-text">商品描述：{product.description}</p>
                <p className="card-text">商品內容：{product.content}</p>
                <div className="d-flex">
                  <p className="card-text text-secondary">
                    <del>{product.origin_price}</del>
                  </p>
                  元 / {product.price} 元
                </div>
                <h5 className="mt-3">更多圖片：</h5>
                <div className="d-flex flex-wrap">
                  {product.imagesUrl.map((item) => (
                    <img key={item} src={item} className="images" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary">請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<App />);
