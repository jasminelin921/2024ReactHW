import { useEffect, useState } from "react";
import "./assets/style.scss";
import axios from "axios";
import "bootstrap";
import styled from "styled-components";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "jasminelin";

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

function ProductList({ products, setProducts, setIsLoggedIn }) {
  const [tempProduct, setTempProduct] = useState(null);

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
    setTempProduct(null);
    /* 在切換 is_enabled 狀態後，清空商品細節。
    避免在商品被禁用後，user 仍可以查看商品詳細資訊。*/
  };

  // styled component：取得對應商品的主圖片，作為 props 傳入，進行背景設定
  const CardImg = styled.div`
    background-image: url(${(props) =>
      props.productimg ||
      "https://images.unsplash.com/photo-1653842647607-cc422aa39e42"});
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 0.5rem 0.5rem 0 0;
  `;

  return (
    <div className="productsPage">
      <div className="products">
        <button className="btn" type="button" id="btnByLogout" onClick={logout}>
          Logout
        </button>
        <div id="productsList">
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
            <tbody className="table-group-divider">
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
                      className="btn"
                      onClick={() => toggleProductStatus(index)}
                    >
                      {item.is_enabled ? "是" : "否"}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`btn ${
                        item.is_enabled ? "" : "btn-primary disabled"
                      }`} // 若產品未啟用，按鈕無法點擊
                      onClick={() => {
                        setTempProduct(item);
                      }}
                    >
                      查看細節
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="productDetail">
          <h2>單一產品細節</h2>
          {tempProduct ? (
            <div className="card mb-3">
              {/* styled compotent：背景圖片 */}
              <CardImg productimg={tempProduct.imageUrl}>
                <div className="blur">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                </div>
              </CardImg>
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge ms-2">{tempProduct.category}</span>
                </h5>
                <p className="card-text">商品描述：{tempProduct.description}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <div className="d-flex">
                  <p className="card-text text-secondary">
                    <del>{tempProduct.origin_price}</del>
                  </p>
                  元 / {tempProduct.price} 元
                </div>
                <h6 className="mt-3">更多圖片：</h6>
                <div className="d-flex flex-wrap">
                  {tempProduct.imagesUrl.map((item) => (
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

  // 尚在檢查登入狀態（避免在已登入狀態將商品列表頁重新整理時，畫面會先跳到登入頁再跳回來）
  if (isLoggedIn === null) {
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

  // 依照 isLoggedIn 狀態切換畫面
  return (
    <>
      {isLoggedIn ? (
        <ProductList
          setIsLoggedIn={setIsLoggedIn}
          products={products}
          setProducts={setProducts}
        />
      ) : (
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

export default App;
