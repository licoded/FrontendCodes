function MDN() {
  return (
    <article className="main-page-content" lang="en-US" style={{ height: 'auto' }}>
      <header>
        <h1>滚动锚定指南</h1>
      </header>
      <div className="section-content">
        <p>作为 Web 用户，您可能熟悉滚动锚定解决的问题。您在缓慢的连接上浏览到一个长页面并开始滚动阅读内容；当您忙于阅读时，您正在查看的页面部分突然跳动。发生这种情况是因为大型图像或某些其他元素刚刚在内容的更上方加载。</p>
        <p>滚动锚定是浏览器的一项功能，旨在解决内容跳动的问题，如果内容在用户已滚动到文档的新部分后加载，就会发生这种情况。</p>
      </div>
      <section aria-labelledby="how_does_it_work">
        <h2 id="how_does_it_work">
          <a href="#how_does_it_work">它是如何工作的？</a>
        </h2>
        <div className="section-content">
          <p>滚动锚定调整滚动位置以补偿视口外部的变化。这意味着用户正在查看的文档中的点保留在视口中，这可能意味着他们的滚动位置实际上在他们已浏览文档的<em>距离</em>方面发生了变化。</p>
        </div>
      </section>
      <section aria-labelledby="how_do_i_turn_on_scroll_anchoring">
        <h2 id="how_do_i_turn_on_scroll_anchoring">
          <a href="#how_do_i_turn_on_scroll_anchoring">如何开启滚动锚定？</a>
        </h2>
        <div className="section-content">
          <p>您不需要！此功能在支持的浏览器中默认启用。在大多数情况下，锚定滚动正是您想要的——内容跳动对任何人都来说都是糟糕的体验。</p>
        </div>
      </section>
      <section aria-labelledby="what_if_i_need_to_debug_it" style={{ height: 'auto' }}>
        <h2 id="what_if_i_need_to_debug_it">
          <a href="#what_if_i_need_to_debug_it">如果需要调试怎么办？</a>
        </h2>
        <div className="section-content" style={{ height: 'auto' }}>
          <p>如果您的页面在启用滚动锚定后行为异常，可能是因为某些<code>scroll</code>事件侦听器没有很好地处理额外的滚动以补偿锚节点的移动。</p>
          <p>您可以通过在 Firefox 中将<code>layout.css.scroll-anchoring.enabled</code>更改为<code>false</code>（在<code>about:config</code>中）来检查禁用滚动锚定是否可以解决此问题。</p>
          
          {/* 注意: 下方的广告代码是直接转换的。在实际的 React 应用中，
              处理第三方广告脚本通常需要更复杂的处理，例如使用 useEffect 或专门的库。 */}
          <div className="google-auto-placed ap_container" style={{ width: '100%', height: 'auto', clear: 'both', textAlign: 'center' }}>
            <ins data-ad-format="auto" className="adsbygoogle adsbygoogle-noablate" data-ad-client="ca-pub-8543159550507237" data-adsbygoogle-status="done" style={{ display: 'block', margin: 'auto', backgroundColor: 'transparent', height: '0px' }} data-ad-status="unfilled">
              <div id="aswift_1_host" style={{ border: 'none', height: '0px', width: '748px', margin: '0px', padding: '0px', position: 'relative', visibility: 'visible', backgroundColor: 'transparent', display: 'inline-block', overflow: 'hidden', opacity: '0' }}>
                <iframe 
                  id="aswift_1" 
                  name="aswift_1" 
                  title="Advertisement" 
                  aria-label="Advertisement"
                  style={{ left: '0px', position: 'absolute', top: '0px', border: '0px', width: '748px', height: '0px', minHeight: 'auto', maxHeight: 'none', minWidth: 'auto', maxWidth: 'none' }} 
                  sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" 
                  width="748" 
                  height="0" 
                  frameBorder="0" 
                  marginWidth="0" 
                  marginHeight="0" 
                  vspace="0" 
                  hspace="0" 
                  allowTransparency="true" 
                  scrolling="no" 
                  allow="attribution-reporting; run-ad-auction" 
                  src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-8543159550507237&amp;output=html&amp;h=280&amp;adk=3977224123&amp;adf=2958726011&amp;pi=t.aa~a.1374882230~i.2~rp.4&amp;w=748&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1742235772&amp;num_ads=1&amp;rafmt=1&amp;armr=3&amp;sem=mc&amp;pwprc=5973180809&amp;ad_type=text_image&amp;format=748x280&amp;url=https%3A%2F%2Fmdn.org.cn%2Fen-US%2Fdocs%2FWeb%2FCSS%2Foverflow-anchor%2FGuide_to_scroll_anchoring&amp;fwr=0&amp;pra=3&amp;rh=187&amp;rw=747&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;fa=27&amp;uach=WyJtYWNPUyIsIjE1LjUuMCIsImFybSIsIiIsIjE0MC4wLjM0ODUuOTQiLG51bGwsMCxudWxsLCI2NCIsW1siQ2hyb21pdW0iLCIxNDAuMC43MzM5LjIwOCJdLFsiTm90PUE_QnJhbmQiLCIyNC4wLjAuMCJdLFsiTWljcm9zb2Z0IEVkZ2UiLCIxNDAuMC4zNDg1Ljk0Il1dLDBd&amp;abgtt=6&amp;dt=1759194843003&amp;bpp=1&amp;bdt=1539&amp;idt=1&amp;shv=r20250929&amp;mjsv=m202509230101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie_enabled=1&amp;eoidce=1&amp;prev_fmts=0x0&amp;nras=2&amp;correlator=4472972127543&amp;frm=20&amp;pv=1&amp;u_tz=480&amp;u_his=2&amp;u_h=956&amp;u_w=1470&amp;u_ah=918&amp;u_aw=1470&amp;u_cd=30&amp;u_sd=2&amp;dmc=8&amp;adx=363&amp;ady=948&amp;biw=1415&amp;bih=834&amp;scr_x=0&amp;scr_y=0&amp;eid=31094693%2C31094915%2C95372358%2C42533294&amp;oid=2&amp;pvsid=2208600585420400&amp;tmod=438878107&amp;uas=0&amp;nvt=1&amp;fc=1408&amp;brdim=0%2C38%2C0%2C38%2C1470%2C38%2C1470%2C918%2C1415%2C834&amp;vis=1&amp;rsz=%7C%7Cs%7C&amp;abl=NS&amp;fu=128&amp;bc=31&amp;bz=1.04&amp;td=1&amp;tdf=2&amp;psd=W251bGwsbnVsbCxudWxsLDNd&amp;nt=1&amp;ifi=2&amp;uci=a!2&amp;btvi=1&amp;fsb=1&amp;dtd=4"
                  data-google-container-id="a!2" 
                  tabIndex="0" 
                  data-load-complete="true" 
                  data-google-query-id="CO3a5b2n_48DFRLJFgUdheo1YA"
                  browsingTopics={true}
                ></iframe>
              </div>
            </ins>
          </div>
          <p>如果可以，您可以使用<code>layout.css.scroll-anchoring.highlight</code>开关检查 Firefox 使用哪个节点作为锚点。这将在锚节点顶部显示一个紫色覆盖层。</p>
          <p>如果一个节点似乎不适合作为锚点，您可以使用<a href="/en-US/docs/Web/CSS/overflow-anchor"><code>overflow-anchor</code></a>将其排除，如下所述。</p>
        </div>
      </section>
      <section aria-labelledby="what_if_i_need_to_disable_it">
        <h2 id="what_if_i_need_to_disable_it">
          <a href="#what_if_i_need_to_disable_it">如果需要禁用怎么办？</a>
        </h2>
        <div className="section-content">
          <p>规范提供了一个新属性，<a href="/en-US/docs/Web/CSS/overflow-anchor"><code>overflow-anchor</code></a>，可用于禁用文档全部或部分的滚动锚定。这实质上是一种选择退出新行为的方式。</p>
          <p>唯一可能的值是<code>auto</code>或<code>none</code></p>
          <ul>
            <li><code>auto</code>是初始值；只要用户拥有支持的浏览器，滚动锚定行为就会发生，他们应该会看到更少的跳动内容。</li>
            <li><code>none</code>表示您已明确选择将文档或文档的一部分排除在滚动锚定之外。</li>
          </ul>
          <p>要选择退出整个文档，您可以在<a href="/en-US/docs/Web/HTML/Element/body"><code>&lt;body&gt;</code></a>元素上设置它</p>
          <div className="code-example">
            <div className="example-header"><span className="language-name">css</span></div>
            <pre className="brush: css notranslate" data-signature="f8qKWWCROmRrqoBto/wLKvXmebilud/THeT2KDPCsRg=">
              <code>
                <span className="token selector">body</span> <span className="token punctuation">{'{'}</span>
                {'\n  '}<span className="token property">overflow-anchor</span><span className="token punctuation">:</span> none<span className="token punctuation">;</span>
                {'\n'}<span className="token punctuation">{'}'}</span>
              </code>
            </pre>
          </div>
          <p>要选择退出文档的某个特定部分，请在其容器元素上使用<code>overflow-anchor: none</code></p>
          <div className="code-example">
            <div className="example-header"><span className="language-name">css</span></div>
            <pre className="brush: css notranslate" data-signature="0IW3RfRCqJHni0qn/aChZtur44308bEy/7gB600AI/Q=">
              <code>
                <span className="token selector">.container</span> <span className="token punctuation">{'{'}</span>
                {'\n  '}<span className="token property">overflow-anchor</span><span className="token punctuation">:</span> none<span className="token punctuation">;</span>
                {'\n'}<span className="token punctuation">{'}'}</span>
              </code>
            </pre>
          </div>
          <div className="notecard note" id="sect1">
            <p><strong>注意：</strong>规范详细说明，一旦选择退出滚动锚定，您就无法从子元素中重新选择加入。例如，如果您选择退出整个文档，则将无法在文档的其他位置设置<code>overflow-anchor: auto</code>以将其重新打开以用于某个子部分。</p>
          </div>
        </div>
      </section>
      <section aria-labelledby="suppression_triggers">
        <h3 id="suppression_triggers">
          <a href="#suppression_triggers">抑制触发器</a>
        </h3>
        <div className="section-content">
          <p>规范中还详细说明了一些<em>抑制触发器</em>，这些触发器将在可能存在问题的某些地方禁用滚动锚定。如果任何触发器发生在锚节点或其祖先节点上，则会抑制锚定。</p>
          <p>这些抑制触发器是对以下任何属性的计算值的更改</p>
          <ul>
            <li><a href="/en-US/docs/Web/CSS/top"><code>top</code></a>、<a href="/en-US/docs/Web/CSS/left"><code>left</code></a>、<a href="/en-US/docs/Web/CSS/right"><code>right</code></a>或<a href="/en-US/docs/Web/CSS/bottom"><code>bottom</code></a></li>
            <li><a href="/en-US/docs/Web/CSS/margin"><code>margin</code></a>或<a href="/en-US/docs/Web/CSS/padding"><code>padding</code></a></li>
            <li>任何与<a href="/en-US/docs/Web/CSS/width"><code>width</code></a>或<a href="/en-US/docs/Web/CSS/height"><code>height</code></a>相关的属性</li>
            <li><a href="/en-US/docs/Web/CSS/transform"><code>transform</code></a>以及各个变换属性<a href="/en-US/docs/Web/CSS/translate"><code>translate</code></a>、<a href="/en-US/docs/Web/CSS/scale"><code>scale</code></a>和<a href="/en-US/docs/Web/CSS/rotate"><code>rotate</code></a></li>
          </ul>
          <p>此外，在滚动框内的任何位置更改<a href="/en-US/docs/Web/CSS/position"><code>position</code></a>也会禁用滚动锚定。</p>
          <div className="notecard note" id="sect2">
            <p><strong>注意：</strong>在<a href="https://bugzil.la/1584285" className="external" target="_blank" rel="noopener noreferrer">Firefox bug 1584285</a>中，添加了<code>layout.css.scroll-anchoring.suppressions.enabled</code>标志到 Firefox Nightly，以便允许禁用这些触发器。</p>
          </div>
        </div>
      </section>
      <section aria-labelledby="further_reading">
        <h2 id="further_reading">
          <a href="#further_reading">进一步阅读</a>
        </h2>
        <div className="section-content">
          <ul>
            <li><a href="https://github.com/WICG/ScrollAnchoring/blob/master/explainer.md" className="external" target="_blank" rel="noopener noreferrer">WICG 网站上的解释文档</a></li>
            <li><a href="https://blog.chromium.org/2017/04/scroll-anchoring-for-web-developers.html" className="external" target="_blank" rel="noopener noreferrer">Chromium 博客上针对 Web 开发人员的滚动锚定</a></li>
          </ul>
        </div>
      </section>
      <h2 id="browser_compatibility">
        <a href="#browser_compatibility">浏览器兼容性</a>
      </h2>
      <p>BCD 表格仅在浏览器中加载
        <noscript>
          {/* */}
          已启用 JavaScript。启用 JavaScript 以查看数据。
        </noscript>
      </p>
      <section aria-labelledby="compatibility_notes">
        <h3 id="compatibility_notes">
          <a href="#compatibility_notes">兼容性说明</a>
        </h3>
        <div className="section-content">
          <p>如果您需要测试浏览器中是否可用滚动锚定，请使用<a href="/en-US/docs/Web/CSS/@supports">功能查询</a>来测试对<code>overflow-anchor</code>属性的支持。</p>
        </div>
      </section>
    </article>
  );
}

export default MDN;