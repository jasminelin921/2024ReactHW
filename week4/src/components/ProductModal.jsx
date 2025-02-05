import { useEffect } from "react";
import * as bootstrap from "bootstrap";

function ProductModal({
  productModalRef,
  templateData,
  openModal,
  closeModal,
  handleInputChange,
  handleFileFormSubmit,
  handleFileChange,
  uploadImgURL,
  setUploadImgURL,
  imageUrlInputRef,
  handleImgsAdd,
  handleImgDelete,
  currentItem,
  addNewProduct,
  updateProductData,
  isClicked,
  fileInputRef,
}) {
  useEffect(() => {
    // 取得 Bootstrap Modal 的 DOM 元素
    const modalElement = document.querySelector("#productModal");

    // 初始化 Bootstrap Modal 實例，並將其保存到 productModalRef.current
    productModalRef.current = new bootstrap.Modal(modalElement, {
      backdrop: true, // 設定 backdrop（背景遮罩）可顯示，並允許點擊關閉 Modal
      keyboard: false, // 禁用 Esc 鍵關閉 Modal
    });

    // 定義當 Modal 關閉時要執行的動作
    const handleHideModal = () => {
      // 清除當前焦點，避免 Modal 關閉時仍然停留在按鈕或輸入框上
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur(); // 讓當前聚焦的元素失去焦點
      }
      // 清空 input[type="file"] 欄位
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploadImgURL("");
    };

    // 監聽 Bootstrap `hide.bs.modal` 事件：當 Modal 關閉時執行 `handleHideModal`
    modalElement.addEventListener("hide.bs.modal", handleHideModal);

    // 清理函式
    return () => {
      // 釋放 Bootstrap Modal 實例，避免記憶體洩漏
      productModalRef.current.dispose();
      // 移除 Modal 的事件監聽器，確保組件卸載時不會再執行 `handleHideModal`
      modalElement.removeEventListener("hide.bs.modal", handleHideModal);
    };
  }, []);

  // 點擊編輯按鈕取得 currentItem 後，自動開啟 Modal
  useEffect(() => {
    if (currentItem) {
      openModal(currentItem);
    }
  }, [currentItem]);

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

  return (
    <>
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        ref={productModalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {currentItem ? "編輯商品" : "新增商品"}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Close"
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // 阻止表單的預設提交行為
                if (currentItem) {
                  updateProductData();
                } else {
                  addNewProduct();
                }
              }}
            >
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="title" className="form-label">
                      商品名稱<span>*</span>
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
                      分類<span>*</span>
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
                      啟用商品<span>*</span>
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
                  <div className="col-md-3">
                    <label htmlFor="num" className="form-label">
                      數量<span>*</span>
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
                      單位<span>*</span>
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
                      原價<span>*</span>
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
                      售價<span>*</span>
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
                  <div className="col-12">
                    <label htmlFor="description" className="form-label">
                      商品描述<span>*</span>
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
                      內容說明<span>*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="content"
                      placeholder="content"
                      name="content.productContent"
                      value={content.productContent}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="content" className="form-label">
                      注意事項
                    </label>
                    <textarea
                      className="form-control"
                      id="notice"
                      placeholder="notice"
                      name="content.notice"
                      value={content.notice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <hr />
                  <div className="col-md-6">
                    <label htmlFor="imageUrl" className="form-label">
                      商品主圖<span>*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="imageUrl"
                      name="imageUrl"
                      value={imageUrl}
                      placeholder="main image URL"
                      onChange={handleInputChange}
                      required
                    />
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="主圖"
                        className="img-fluid mainImg"
                      />
                    ) : null}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fileInput" className="form-label">
                      圖檔上傳
                    </label>
                    <div className="updateImg">
                      <input
                        type="file"
                        name="file-to-upload"
                        id="file-to-upload"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <button
                        type="submit"
                        className="btn btn-save"
                        id="btnByUpdateImg"
                        onClick={handleFileFormSubmit}
                      >
                        上傳
                      </button>
                    </div>
                    {uploadImgURL ? (
                      <img
                        src={uploadImgURL}
                        alt="圖檔"
                        className="img-fluid mainImg"
                      />
                    ) : null}
                  </div>
                  <div className="col">
                    <label htmlFor="imagesURL" className="form-label">
                      其他圖片
                    </label>
                    <div className="otherImgsInput">
                      <input
                        type="url"
                        className="form-control"
                        id="imagesURL"
                        placeholder="image URL"
                        ref={imageUrlInputRef} // 綁定 ref 到輸入框
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
                </div>
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
                  type="submit"
                  className="btn btn-save"
                  disabled={isClicked} // 按鈕啟用、禁用切換，避免重複點擊
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductModal;
