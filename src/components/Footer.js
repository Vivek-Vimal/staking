const Footer = () => {
  return (
    <div>
      <div className="container_fluid ">
        <hr className="hr-a footer_hr" />
      </div>
      <section className="top_section_outer">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="nav-header">
              <a className="navbar-brand">
                <p className="copy-right mb-0">© Bird Stake</p>
              </a>
            </div>
            <div className="nav-right">
              <div className="topbar-button">
                <div className="copy-right_list_outer">
                  <ul className="footer_copyright_list">
                    <li>
                      <a href="https://birdstaking.gitbook.io/bird-staking/">
                        whitepaper
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://t.me/+4ofg7Q88dcViODJh"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="data:image/png;base64,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"
                          alt="icon"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </section>
    </div>
  );
};

export default Footer;
