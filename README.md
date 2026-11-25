# Nexus Architects — 互動式 3D 建築與室內空間展示網站

**Connecting visions, shaping spaces.／連結願景，形塑空間。**

基於 WebGL / Three.js 打造的建築師事務所互動網站，讓訪客能直接在瀏覽器中進行 3D 建築外觀旋轉、剖面開頂透視、室內空間第一人稱漫遊，以及即時日照光影模擬。

## 主要功能

- **三款切換式 3D 建築與室內模型**
  - **山丘光影宅邸 (Hillside Courtyard Villa)** — 建築設計與規劃
  - **雲境垂直藝廊 (Atrium Loft & Tea Salon)** — 室內與空間設計
  - **舊倉新生文創館 (Heritage Brick & Timber Renewal)** — 老屋改造與都市更新
- **四種空間檢視模式**：建築外觀 360° 旋轉、剖面開頂透視、頂視平面、室內空間漫遊（支援 `W A S D` / 方向鍵移動與空間點位瞬移）
- **即時日照與材質切換**：06:00–22:00 日照與夜景燈光模擬，以及擬真材質／白模量體／線框藍圖切換
- **完整品牌介紹**：設計哲學、四階段設計方法、三大服務範圍與預約諮詢介面

## 技術架構

- HTML5 / CSS3（Dune 建築編輯風格配色系統）
- Vanilla JavaScript (ES Modules)
- Three.js (WebGL2, OrbitControls, Procedural Architectural Textures)
