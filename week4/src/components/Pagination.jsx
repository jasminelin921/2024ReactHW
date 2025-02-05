function Pagination({ pagination, changePage }) {
  // 切換頁碼
  const handlePageChange = (e, page) => {
    e.preventDefault();
    changePage(page);
  };

  return (
    <nav>
      <ul id="pageNation">
        <li className="pageItem">
          <a
            href="/"
            aria-label="Previous"
            className={`pageLinkNoClick ${
              pagination.has_pre ? "pageLink" : "disabled"
            }`}
            onClick={(e) => handlePageChange(e, pagination.current_page - 1)}
          >
            <span className="pageText">&lt;</span>
          </a>
        </li>
        {[...new Array(pagination.total_pages)].map((_, i) => (
          <li className="pageItem" key={`${i}_page`}>
            <a
              className="pageLink pageActive"
              href="/"
              onClick={(e) => handlePageChange(e, i + 1)}
              style={{
                backgroundColor:
                  pagination.current_page === i + 1 ? "#c7d2b2" : "#ffffff",
                color:
                  pagination.current_page === i + 1
                    ? "#ffffff"
                    : "rgb(90, 103, 67)",
              }}
            >
              <span className="pageText">{i + 1}</span>
            </a>
          </li>
        ))}
        <li className="pageItem">
          <a
            className={`pageLinkNoClick ${
              pagination.has_next ? "pageLink" : "disabled"
            }`}
            onClick={(e) => handlePageChange(e, pagination.current_page + 1)}
            href="/"
            aria-label="Next"
          >
            <span className="pageText">&gt;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
