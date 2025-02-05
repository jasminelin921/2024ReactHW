import Pagination from "./Pagination";

function ProductList({
  products,
  logout,
  toggleProductStatus,
  disabledButtons,
  getProductData,
  deleteProductData,
  setCurrentItem,
  pagination,
  openModal,
}) {
  return (
    <div className="productsPage">
      <div className="products">
        <button className="btn" type="button" id="btnByLogout" onClick={logout}>
          Logout
        </button>
        <div id="productsList">
          <div className="title">
            <h2>商品列表</h2>
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#productModal"
              id="btnByAdd"
              data-type="add"
              onClick={() => {
                setCurrentItem(null);
                openModal();
              }}
            >
              新增商品＋
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "300px" }}>商品名稱</th>
                <th style={{ width: "150px" }}>原價</th>
                <th style={{ width: "150px" }}>售價</th>
                <th style={{ width: "250px" }}>狀態</th>
                <th style={{ width: "250px" }}>編輯</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <del>{item.origin_price}</del>
                  </td>
                  <td>{item.price}</td>
                  <td>
                    <div id="productState">
                      {item.is_enabled ? (
                        <span style={{ marginRight: "20px" }}>啟用</span>
                      ) : (
                        <span style={{ color: "rgb(164, 115, 105)" }}>
                          未啟用
                        </span>
                      )}
                      <button
                        className="btn"
                        id="btnByState"
                        onClick={() => toggleProductStatus(item)}
                        disabled={disabledButtons[item.id] || false} // 只禁用當前按鈕
                      >
                        變更狀態
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#productModal"
                      id="btnByEdit"
                      onClick={() => setCurrentItem(item)}
                    >
                      編輯
                    </button>
                    <button
                      className="btn btnByDelete"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteWarnModal"
                    >
                      刪除
                    </button>
                    <div
                      className="modal fade"
                      id="deleteWarnModal"
                      tabIndex="-1"
                      aria-labelledby="deleteWarnModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              刪除確認
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <h3 style={{ color: "rgb(164, 115, 105)" }}>
                              確認刪除{" "}
                              <span style={{ color: "rgb(90, 103, 67)" }}>
                                {item.title}
                              </span>{" "}
                              這筆資料嗎？
                            </h3>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btnByDelete"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                deleteProductData(item);
                              }}
                            >
                              確認
                            </button>
                            <button
                              type="button"
                              className="btn"
                              data-bs-dismiss="modal"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} changePage={getProductData} />
        </div>
      </div>
    </div>
  );
}

export default ProductList;
