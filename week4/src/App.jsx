import "./assets/style.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";

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

function LoginForm({ setIsLoggedIn, getProductData }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleFormInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表單提交的預設行為（點擊 Submit 按鈕時，表單不會提交，頁面不會刷新）
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data; // 取得回傳資料
      document.cookie = `userToken=${token}; expires=${new Date(expired)}`; // 建立 cookie
      axios.defaults.headers.common.Authorization = `${token}`;
      getProductData();
      setIsLoggedIn(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      const errorCode = err.response?.data?.error?.code || "Unknown error";
      alert(`${errorMessage} : ${errorCode}`);
    }
  };

  return (
    <div className="loginPage">
      <section className="loginForm">
        <h1>Login</h1>
        <form id="form" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label className="form-label " htmlFor="username">
              信箱
            </label>
            <input
              className="form-control"
              type="email"
              id="username"
              placeholder="email"
              value={formData.username}
              onChange={handleFormInputChange}
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
              value={formData.password}
              onChange={handleFormInputChange}
              required
            />
          </div>
          {/* type="submit" 用於提交表單的標準方式 */}
          <button type="submit" className="btn">
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  // 登入驗證
  const checkIsLoggedIn = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/user/check`);
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      console.error(
        err.response?.data?.message || "Error: Login request failed"
      );
    }
  };

  useEffect(() => {
    // 取得 token，每次發送請求時動態將 token 加入到 headers
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;

    checkIsLoggedIn(); // 登入驗證
  }, []);

  useEffect(() => {
    getProductData();
  }, [isLoggedIn]);

  const logout = async () => {
    try {
      const res = await axios.post(`${API_BASE}/logout`);
      document.cookie = `userToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`; // 讓 cookie 過期以自動清除 token
      setIsLoggedIn(false); // 切換登入狀態，回到登入頁面
      console.log(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  // 切換商品 is_enable 狀態
  const [disabledButtons, setDisabledButtons] = useState({}); // 設定每個變更狀態按鈕的 disable 狀態
  const toggleProductStatus = async (item) => {
    setDisabledButtons((prev) => ({ ...prev, [item.id]: true })); // 只禁用當前按鈕
    try {
      // 切換狀態值
      const updatedStatus = item.is_enabled === 1 ? 0 : 1;
      // 更新產品資料
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/product/${item.id}`,
        {
          data: {
            ...item,
            is_enabled: updatedStatus,
          },
        }
      );
      console.log(res.data.message);
      getProductData(pagination.current_page); // 參數指定要取得對應頁數的商品資料
    } catch (err) {
      alert(err.response?.data?.message || "狀態切換失敗");
    } finally {
      setDisabledButtons((prev) => ({ ...prev, [item.id]: false })); // 變更狀態完成後解除禁用
    }
  };

  // 預設取得第一頁的商品資料
  const getProductData = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err.response?.data?.message || "商品讀取失敗");
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
      alert(err.response?.data?.message || "商品刪除失敗");
    }
  };

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
    setIsClicked(true); // 禁用按鈕
    try {
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/product`,
        productData
      );
      alert(res.data.message);
      closeModal();
      getProductData(); // 重新載入產品資料
    } catch (err) {
      alert(err.response?.data?.message || "新增產品失敗");
    } finally {
      setIsClicked(false); // 重啟按鈕
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
        `${API_BASE}/api/${API_PATH}/admin/product/${updateProduct.data.id}`,
        updateProduct
      );
      closeModal();
      getProductData();
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "編輯產品失敗");
    } finally {
      setIsClicked(false); // 重啟儲存按鈕
    }
  };

  const productModalRef = useRef(null);

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
    content: { productContent: "", notice: "" },
    is_enabled: false,
    imagesUrl: [],
  });

  const [currentItem, setCurrentItem] = useState(null);

  const openModal = (item) => {
    if (item) {
      // 編輯模式
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
        content: item.content || { productContent: "", notice: "" },
        is_enabled: item.is_enabled || 0,
        imagesUrl: item.imagesUrl || [],
      });
    } else {
      // 新增模式
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
        content: { productContent: "", notice: "" },
        is_enabled: false,
        imagesUrl: [],
      });
    }
    productModalRef.current.show(); // 顯示 Modal
  };

  const closeModal = () => {
    setUploadImgURL("");
    fileInputRef.current.value = "";
    productModalRef.current.hide(); // 隱藏 Modal
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove(); // 確保背景被移除
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prevTemplateData) => {
      // 判斷是否是嵌套的 content 欄位
      if (name.startsWith("content.")) {
        const contentKey = name.split(".")[1]; // 取得對應 content 底下的 key 名稱
        return {
          ...prevTemplateData,
          content: {
            ...prevTemplateData.content,
            [contentKey]: value,
          },
        };
      }
      // 非嵌套欄位的處理
      return {
        ...prevTemplateData,
        [name]: value,
      };
    });
  };

  // 圖檔上傳相關
  const [formData, setFormData] = useState();
  const [uploadImgURL, setUploadImgURL] = useState("");
  const fileInputRef = useRef(null);
  const handleFileFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 指定類型
          },
        }
      );
      console.log("Upload successful:", res.data);
      alert("上傳成功！");
      setUploadImgURL(res.data.imageUrl);
      fileInputRef.current.value = ""; // 清空 input[type="file"] 的內容
      setFormData();
    } catch (err) {
      alert(err.response?.data?.message || "上傳失敗");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 獲取第一個選中的文件
    if (!file) {
      alert("請選擇圖檔");
      return;
    }
    const newFormData = new FormData();
    newFormData.append("file-to-upload", file);

    setFormData(newFormData); // 儲存文件資料到狀態
    console.log("File ready to upload:", file);
  };

  // 其他圖片上傳相關
  const imageUrlInputRef = useRef(null);
  const handleImgsAdd = () => {
    const newImgURL = imageUrlInputRef.current.value; // 獲取 imagesURL input 的值
    if (newImgURL.trim()) {
      // trim()：移除字串起始及結尾處的空白字元
      setTemplateData((prevData) => ({
        ...prevData,
        imagesUrl: [...prevData.imagesUrl, newImgURL], // 新增圖片到陣列
      }));
    }
    imageUrlInputRef.current.value = ""; // 清空輸入框
  };

  const handleImgDelete = (indexToRemove) => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: prevData.imagesUrl.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // 尚在檢查登入狀態
  if (isLoggedIn === null) {
    return <Loading />;
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <ProductList
            products={products}
            logout={logout}
            toggleProductStatus={toggleProductStatus}
            disabledButtons={disabledButtons}
            getProductData={getProductData}
            deleteProductData={deleteProductData}
            setCurrentItem={setCurrentItem}
            pagination={pagination}
            openModal={openModal}
          />
        </>
      ) : (
        <LoginForm
          setIsLoggedIn={setIsLoggedIn}
          getProductData={getProductData}
        />
      )}
      <ProductModal
        productModalRef={productModalRef}
        templateData={templateData}
        openModal={openModal}
        closeModal={closeModal}
        handleInputChange={handleInputChange}
        handleFileFormSubmit={handleFileFormSubmit}
        handleFileChange={handleFileChange}
        uploadImgURL={uploadImgURL}
        setUploadImgURL={setUploadImgURL}
        imageUrlInputRef={imageUrlInputRef}
        handleImgsAdd={handleImgsAdd}
        handleImgDelete={handleImgDelete}
        currentItem={currentItem}
        addNewProduct={addNewProduct}
        updateProductData={updateProductData}
        isClicked={isClicked}
        fileInputRef={fileInputRef}
      />
    </>
  );
}

export default App;
