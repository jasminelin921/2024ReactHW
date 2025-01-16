import "./assets/style.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "jasminelin";

function Loading() {
  return (
    // loading page 動畫元素
    <div className="loading">
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
      <div className="loadingItem" />
    </div>
  );
}

function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const onEmail = (e) => {
    setEmail(e.target.value);
  };
  const onPw = (e) => {
    setPw(e.target.value);
  };
  const username = email;
  const password = pw;
  const user = {
    username,
    password,
  };
  function login() {
    (async () => {
      try {
        const res = await axios.post(`${API_BASE}/admin/signin`, user);
        const { token, expired } = res.data; // 取得回傳資料
        document.cookie = `userToken=${token}; expires=${new Date(expired)}`; // 建立 cookie
        setIsLoggedIn(true);
      } catch (err) {
        alert(err.response.data.message + ` : ` + err.response.data.error.code);
      }
    })();
  }

  return (
    <div className="loginPage">
      <section className="loginForm">
        <h1>Login</h1>
        <form>
          <div className="inputGroup">
            <label className="form-label " htmlFor="email">
              信箱
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={onEmail}
              required
            />
          </div>
          <div className="inputGroup">
            <label className="form-label" htmlFor="password">
              密碼
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              placeholder="password"
              value={pw}
              onChange={onPw}
              required
            />
          </div>
          <button type="button" className="btn" onClick={login}>
            登入
          </button>
        </form>
        <div className="text">
          沒有帳號？
          <a href="https://ec-course-api.hexschool.io/">立即註冊</a>
        </div>
      </section>
      <section className="loginImg">
        <div className="slogan">
          <h1>
            Lazybones
            <br />
            Farm
          </h1>
          <div>Effortless farming for the relaxed soul.</div>
        </div>
      </section>
    </div>
  );
}

function Modal({ currentItem, getProductData }) {
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    num: 0,
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  });
  const productModalRef = useRef(null);

  useEffect(() => {
    const modalElement = document.querySelector("#productModal");
    // 初始化 Bootstrap Modal 實例，並將其保存到 productModalRef.current
    productModalRef.current = new bootstrap.Modal(modalElement, {
      backdrop: true, // 確保 backdrop 可被移除
      keyboard: false, // 禁用 Esc 鍵關閉模態框
    });

    // 將 Modal 綁定 hide.bs.modal 事件（Bootstrap 提供的模態框事件，在模態框即將隱藏時觸發）
    const handleHideModal = () => {
      // 在 Modal 關閉時，將焦點從當前活動的元素（document.activeElement）移除。
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    modalElement.addEventListener("hide.bs.modal", handleHideModal);

    return () => {
      productModalRef.current.dispose(); // 清理模態框實例
      modalElement.removeEventListener("hide.bs.modal", handleHideModal);
    };
  }, []);

  const openModal = (item) => {
    if (item) {
      setTemplateData({
        id: item.id || "",
        imageUrl: item.imageUrl || "",
        title: item.title || "",
        category: item.category || "",
        num: item.num || 0,
        unit: item.unit || "",
        origin_price: item.origin_price || "",
        price: item.price || "",
        description: item.description || "",
        content: item.content || "",
        is_enabled: item.is_enabled || 0,
        imagesUrl: item.imagesUrl || [],
      });
    }
    productModalRef.current.show(); // 顯示 Modal
  };

  // 點擊編輯按鈕取得 currentItem 後，自動開啟 Modal
  useEffect(() => {
    if (currentItem) {
      openModal(currentItem);
    }
  }, [currentItem]);

  const closeModal = () => {
    setTemplateData({
      id: "",
      imageUrl: "",
      title: "",
      category: "",
      num: 0,
      unit: "",
      origin_price: "",
      price: "",
      description: "",
      content: "",
      is_enabled: false,
      imagesUrl: [],
    });
    productModalRef.current.hide(); // 隱藏 Modal
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove(); // 確保背景被移除
  };

  const {
    id,
    imageUrl,
    title,
    category,
    num,
    unit,
    origin_price,
    price,
    description,
    content,
    is_enabled,
    imagesUrl,
  } = templateData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prevtTemplateData) => ({
      ...prevtTemplateData,
      [name]: value,
    }));
  };

  const handleImgsAdd = () => {
    const newImgURL = document.getElementById("imagesURL").value; // 獲取 imagesURL input 的值
    if (newImgURL.trim()) {
      // trim()：移除字串起始及結尾處的空白字元
      setTemplateData((prevData) => ({
        ...prevData,
        imagesUrl: [...prevData.imagesUrl, newImgURL], // 新增圖片到陣列
      }));
    }
    document.getElementById("imagesURL").value = ""; // 清空輸入框
  };

  const handleImgDelete = (indexToRemove) => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: prevData.imagesUrl.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // 設定 label 必填樣式
  const theme = {
    color: {
      error: "red", // 定義錯誤訊息的顏色
    },
  };
  const Required = styled.span`
    color: ${(props) => props.theme.color.error};
    margin-left: 2px;
  `;

  const [isClicked, setIsClicked] = useState(0); // 設定儲存按鈕 disable 狀態

  const addNewProduct = async () => {
    const productData = {
      data: {
        ...templateData,
        num: Number(templateData.num),
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: Number(templateData.is_enabled),
        imagesUrl: templateData.imagesUrl,
      },
    };
    setIsClicked(true); // 禁用儲存按鈕
    try {
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/product`,
        productData
      );
      alert(res.data.message);
      setIsClicked(false); // 重置按鈕狀態
      closeModal();
      getProductData();
    } catch (err) {
      alert(err.response.data.message);
      setIsClicked(false); // 啟用儲存按鈕
    }
  };

  const updateProductData = async () => {
    const updateProduct = {
      data: {
        ...templateData,
        num: Number(templateData.num),
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: Number(templateData.is_enabled),
        imagesUrl: templateData.imagesUrl,
      },
    };
    setIsClicked(true); // 禁用儲存按鈕
    try {
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
        updateProduct
      );
      alert(res.data.message);
      setIsClicked(false); // 重置按鈕狀態
      closeModal();
      getProductData();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div
          className="modal fade"
          id="productModal"
          tabIndex="-1"
          aria-labelledby="productModalLabel"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  {id ? "編輯商品" : "新增商品"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <form className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="title" className="form-label">
                      商品名稱<Required>*</Required>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="title"
                      name="title"
                      value={title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="category" className="form-label">
                      分類<Required>*</Required>
                    </label>
                    <select
                      id="category"
                      className="form-select"
                      name="category"
                      value={category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">請選擇...</option>
                      <option value="水果">水果</option>
                      <option value="蔬菜">蔬菜</option>
                      <option value="花卉">花卉</option>
                      <option value="觀葉植物">觀葉植物</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="is_enabled" className="form-label">
                      啟用商品<Required>*</Required>
                    </label>
                    <select
                      id="is_enabled"
                      className="form-select"
                      name="is_enabled"
                      value={is_enabled}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">請選擇...</option>
                      <option value="1">是</option>
                      <option value="0">否</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      商品描述<Required>*</Required>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      placeholder="description"
                      name="description"
                      value={description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="content" className="form-label">
                      內容說明<Required>*</Required>
                    </label>
                    <textarea
                      className="form-control"
                      id="content"
                      placeholder="content"
                      name="content"
                      value={content}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="num" className="form-label">
                      數量<Required>*</Required>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="num"
                      placeholder="number"
                      name="num"
                      value={num}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="unit" className="form-label">
                      單位<Required>*</Required>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="unit"
                      placeholder="unit"
                      name="unit"
                      value={unit}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="origin_price" className="form-label">
                      原價<Required>*</Required>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control prices"
                      id="origin_price"
                      placeholder="origin price"
                      name="origin_price"
                      value={origin_price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="price" className="form-label">
                      售價<Required>*</Required>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control prices"
                      id="price"
                      placeholder="price"
                      name="price"
                      value={price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <hr />
                  <div className="col-md-4">
                    <label htmlFor="imageUrl" className="form-label">
                      商品主圖<Required>*</Required>
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={imageUrl}
                      onChange={handleInputChange}
                      required
                    />
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="主圖"
                        width="310"
                        className="img-fluid mainImg"
                      />
                    ) : null}
                  </div>
                  <div className="col-md-8">
                    <label htmlFor="imagesURL" className="form-label">
                      其他圖片
                    </label>
                    <div className="otherImgsInput">
                      <input
                        type="url"
                        className="form-control"
                        id="imagesURL"
                      />
                      <button
                        type="button"
                        className="btn btn-save"
                        id="btnByAddImg"
                        onClick={handleImgsAdd}
                      >
                        新增
                      </button>
                    </div>
                    <div className="otherImgs">
                      {templateData.imagesUrl.map((imgURL, index) => (
                        <div className="otherImgGroup" key={index}>
                          <img
                            src={imgURL}
                            alt={`圖片 ${index + 1}`}
                            width="124"
                            className="img-fluid otherImg"
                          />
                          <button
                            type="button"
                            className="btnByDelImg"
                            onClick={() => handleImgDelete(index)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={closeModal}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-save"
                  onClick={id ? updateProductData : addNewProduct}
                  disabled={isClicked} // 按鈕啟用、禁用切換，避免重複點擊新增商品
                >
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

function ProductList({ products, setProducts, setIsLoggedIn }) {
  const [currentItem, setCurrentItem] = useState(null);

  // 登出
  async function logout() {
    try {
      const res = await axios.post(`${API_BASE}/logout`);
      document.cookie = `userToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`; // 讓 cookie 過期以自動清除 token
      setIsLoggedIn(false); // 切換登入狀態，回到登入頁面
    } catch (err) {
      console.log(err);
    }
  }

  // 切換商品 is_enable 狀態
  const toggleProductStatus = (index) => {
    setProducts(
      (
        prevProducts // 把最新的狀態值作為參數傳遞給函式
      ) =>
        prevProducts.map((product, key) =>
          key === index
            ? { ...product, is_enabled: !product.is_enabled }
            : product
        )
    );
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const deleteProductData = async (item) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${item.id}`
      );
      alert(res.data.message);
      getProductData();
    } catch (err) {
      alert(err);
    }
  };

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
                openModal();
              }}
            >
              新增商品＋
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>序號</th>
                <th>商品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>狀態</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {/* 商品列表 */}
              {products.map((item, index) => (
                <tr key={item.id}>
                  {/* 如果商品未啟用，商品名稱、原價、售價的顏色則顯示灰色 */}
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>
                    <del>{item.origin_price}</del>
                  </td>
                  <td>{item.price}</td>
                  <td>
                    <div id="productState">
                      {item.is_enabled ? (
                        "啟用"
                      ) : (
                        <span style={{ color: "rgb(164, 115, 105)" }}>
                          未啟用
                        </span>
                      )}
                      <button
                        className="btn"
                        id="btnByState"
                        onClick={() => toggleProductStatus(index)}
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
                      onClick={() => {
                        setCurrentItem(item);
                      }}
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
                      tabindex="-1"
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
                              確認刪除 {item.title} 這筆資料嗎？
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
        </div>
        <Modal currentItem={currentItem} getProductData={getProductData} />
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [products, setProducts] = useState([]);

  // 取得 token，每次發送請求時動態將 token 加入到 headers
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  axios.defaults.headers.common["Authorization"] = token;

  useEffect(() => {
    // 登入驗證
    axios
      .post(`${API_BASE}/api/user/check`)
      .then((res) => {
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });

    // 獲取商品列表
    (async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/admin/products`
        );
        setProducts(response.data.products);
      } catch (err) {
        console.error(err.response?.data?.message || "Error fetching products");
      }
    })();
  }, [isLoggedIn]);

  // 尚在檢查登入狀態
  if (isLoggedIn === null) {
    return <Loading />;
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <ProductList
            setIsLoggedIn={setIsLoggedIn}
            products={products}
            setProducts={setProducts}
          />
        </>
      ) : (
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

export default App;
