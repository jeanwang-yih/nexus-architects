export const PROJECTS = {
  villa: {
    id: 'villa',
    shortName: '山丘光影宅邸',
    englishName: 'Hillside Courtyard Villa',
    category: '建築設計與規劃',
    tag: 'ARCHITECTURE',
    area: '420 m² · 2F',
    description:
      '順應緩坡地形打造的現代合院住宅。以米黃洞石量體、懸挑木質遮陽格柵與靜謐水院為核心，將雙層挑高客廳與二樓夾層書房自然串聯。',
    exteriorCamera: { pos: [23, 15, 24], target: [0, 3.2, 0] },
    cutawayCamera: { pos: [19, 19, 19], target: [0, 2.2, 0] },
    planCamera: { pos: [0.1, 32, 0.1], target: [0, 0, 0] },
    walkBounds: { minX: -9.8, maxX: 9.8, minZ: -8.2, maxZ: 7.2, floorY: 1.7 },
    hotspots: [
      {
        id: 'courtyard',
        label: '水院玄關',
        floor: '1F EXTERIOR COURT',
        description: '入口石階穿過靜謐倒影水池與橄欖樹庭院，透過大面落地玻璃將自然景觀引入室內。',
        camPos: [0, 1.75, 9.8],
        lookAt: [0, 2.3, -2],
        markerPos: [0, 1.3, 6.8],
        cutawayNeeded: false
      },
      {
        id: 'living',
        label: '挑高客廳',
        floor: '1F DOUBLE-HEIGHT LIVING',
        description: '六米四挑高客廳以洞石壁爐主牆定調，清晨與午後的斜射陽光透過格柵在木地板上移動。',
        camPos: [-3.4, 1.7, 3.8],
        lookAt: [2.2, 2.1, -3.2],
        markerPos: [-2.2, 1.5, 0.2],
        cutawayNeeded: false
      },
      {
        id: 'dining',
        label: '中島餐廚',
        floor: '1F KITCHEN & DINING',
        description: '一體成形的洞石中島與長型實木餐桌平行配置，讓烹飪、聚會與水院視野連成一線。',
        camPos: [6.8, 1.7, 3.5],
        lookAt: [1.5, 1.3, -3.5],
        markerPos: [4.2, 1.5, -1.8],
        cutawayNeeded: false
      },
      {
        id: 'mezzanine',
        label: '二樓書房',
        floor: '2F MEZZANINE STUDIO',
        description: '位於二樓的開放式書房與夾層廊道，可俯瞰一樓客廳並遠眺南向山丘景緻。',
        camPos: [-5.5, 5.1, -2.5],
        lookAt: [2.5, 3.4, 2.5],
        markerPos: [-4.2, 4.9, -2.0],
        cutawayNeeded: false
      },
      {
        id: 'terrace',
        label: '懸挑露臺',
        floor: '2F CANTILEVER TERRACE',
        description: '二樓東側懸挑觀景露臺，以木格柵過濾西曬光線，成為傍晚休憩與閱讀的半戶外場域。',
        camPos: [6.5, 5.05, 3.2],
        lookAt: [-1.5, 4.2, -1.5],
        markerPos: [5.8, 4.8, 2.4],
        cutawayNeeded: false
      }
    ]
  },

  atelier: {
    id: 'atelier',
    shortName: '雲境垂直藝廊',
    englishName: 'Atrium Loft & Tea Salon',
    category: '室內與空間設計',
    tag: 'INTERIOR',
    area: '260 m² · LOFT',
    description:
      '以「內與外的無縫延續」為題的複層室內空間設計。結合清水模曲面牆、下沉式茶席客廳、橡木懸浮階梯與高窗漫射光，展現純淨而富有力量的生活尺度。',
    exteriorCamera: { pos: [19, 13, 21], target: [0, 2.8, 0] },
    cutawayCamera: { pos: [16, 17, 17], target: [0, 2.0, 0] },
    planCamera: { pos: [0.1, 28, 0.1], target: [0, 0, 0] },
    walkBounds: { minX: -8.2, maxX: 8.2, minZ: -6.8, maxZ: 6.8, floorY: 1.7 },
    hotspots: [
      {
        id: 'gallery-entry',
        label: '藝廊玄關',
        floor: '1F GALLERY ENTRY',
        description: '洞石雕塑端景與線性洗牆燈引導進入空間，降低外部喧囂、沉澱心境。',
        camPos: [-6.4, 1.7, 5.2],
        lookAt: [1.2, 1.8, -1.5],
        markerPos: [-5.2, 1.4, 3.6],
        cutawayNeeded: false
      },
      {
        id: 'sunken-lounge',
        label: '下沉式茶席客廳',
        floor: '1F SUNKEN LOUNGE',
        description: '圍繞低矮原石茶几展開的下沉式沙發區，強化人與人面對面交流的包覆感與安定感。',
        camPos: [3.2, 1.65, 4.6],
        lookAt: [-1.8, 1.2, -1.2],
        markerPos: [-0.8, 1.3, 1.2],
        cutawayNeeded: false
      },
      {
        id: 'tea-bar',
        label: '石材吧檯區',
        floor: '1F STONE TEA BAR',
        description: '整塊溫潤洞石切削而成的長型茶飲吧檯，上方懸吊黃銅線性吊燈，形成視覺焦點。',
        camPos: [-2.0, 1.7, -4.6],
        lookAt: [4.2, 1.5, -0.5],
        markerPos: [3.4, 1.5, -2.5],
        cutawayNeeded: false
      },
      {
        id: 'loft-bedroom',
        label: '夾層靜謐寢居',
        floor: '2F PRIVATE SUITE',
        description: '木質格柵屏風兼顧採光與隱私，從二樓夾層可欣賞天窗灑下的柔和漫射光。',
        camPos: [4.8, 4.9, -3.5],
        lookAt: [-2.5, 4.0, 1.5],
        markerPos: [3.2, 4.7, -2.8],
        cutawayNeeded: false
      }
    ]
  },

  heritage: {
    id: 'heritage',
    shortName: '舊倉新生文創館',
    englishName: 'Heritage Brick & Timber Renewal',
    category: '老屋改造與都市更新',
    tag: 'RENEWAL',
    area: '580 m² · 2F',
    description:
      '保留老倉庫的紅磚承重牆與大跨距人字木桁架，並在中央植入通透鋼構玻璃天窗中庭與空中書廊，讓歷史記憶與當代咖啡展演空間共存共生。',
    exteriorCamera: { pos: [25, 16, 25], target: [0, 3.6, 0] },
    cutawayCamera: { pos: [21, 20, 21], target: [0, 2.6, 0] },
    planCamera: { pos: [0.1, 34, 0.1], target: [0, 0, 0] },
    walkBounds: { minX: -11.0, maxX: 11.0, minZ: -7.0, maxZ: 7.0, floorY: 1.7 },
    hotspots: [
      {
        id: 'brick-plaza',
        label: '紅磚前庭廣場',
        floor: '1F HERITAGE PLAZA',
        description: '修復後的拱窗紅磚立面搭配新設黑色耐候鋼雨遮，在街角形成開放的都市客廳。',
        camPos: [0, 1.8, 12.2],
        lookAt: [0, 3.4, 0],
        markerPos: [0, 1.4, 8.8],
        cutawayNeeded: false
      },
      {
        id: 'atrium-cafe',
        label: '天井咖啡吧區',
        floor: '1F SKYLIGHT ATRIUM',
        description: '中央挑空天窗將日光垂直導入一樓咖啡吧台與長桌，新舊結構在此交會對話。',
        camPos: [-6.8, 1.7, 3.6],
        lookAt: [2.5, 2.4, -1.2],
        markerPos: [-2.2, 1.5, 0.5],
        cutawayNeeded: false
      },
      {
        id: 'exhibition-hall',
        label: '木構展演大廳',
        floor: '1F TIMBER GALLERY',
        description: '保留原始人字形實木屋架下的開放展覽空間，置入可移動展台與暖色軌道照明。',
        camPos: [8.4, 1.75, 4.2],
        lookAt: [1.5, 2.2, -2.0],
        markerPos: [5.5, 1.5, -1.0],
        cutawayNeeded: false
      },
      {
        id: 'skybox-studio',
        label: '鋼構空中書廊',
        floor: '2F GLASS SKYBOX',
        description: '嵌入舊建築屋頂的新增玻璃量體，提供建築圖書閱覽與俯瞰城市天際線的靜思空間。',
        camPos: [-3.5, 5.5, 3.2],
        lookAt: [3.0, 4.6, -2.5],
        markerPos: [-1.5, 5.2, 0.5],
        cutawayNeeded: false
      }
    ]
  }
};

export const METHODOLOGY_PHASES = {
  '01': {
    code: 'PHASE 01 · UNDERSTAND',
    title: '理解 — 基地風土與生活軌跡盤點',
    summary:
      '實地勘測基地微氣候、日照軌跡、周遭天際線與鄰房關係，同時透過深度訪談梳理業主的生活習慣、家族記憶與長期彈性需求。',
    deliverables: ['基地微氣候日照分析', '法規建蔽容積評估', '空間機能矩陣表', '初期預算與期程規劃']
  },
  '02': {
    code: 'PHASE 02 · TRANSLATE',
    title: '轉譯 — 量體策略與 3D 空間雛形',
    summary:
      '將抽象願景轉譯為具體的軸線、開口比例與動線關係，並透過即時互動 3D 模型讓業主在設計初期就能走進未來的空間體驗光影與尺度。',
    deliverables: ['概念量體 3D 模型', '平面動線與剖面配置', '自然採光與通風模擬', '室內外視線軸線設計']
  },
  '03': {
    code: 'PHASE 03 · INTEGRATE',
    title: '整合 — 結構機電與材料細節推敲',
    summary:
      '攜手結構技師與機電顧問整合管線與結構系統，精選耐候、低碳且隨時間越發溫潤的石材、木構與金屬收邊細節。',
    deliverables: ['BIM 結構機電整合', '實體材料板與光影測試', '細部大樣與收邊圖說', '綠建築永續節能檢討']
  },
  '04': {
    code: 'PHASE 04 · REALIZE',
    title: '實現 — 精準施工圖說與現場監造',
    summary:
      '從建照申請、施工圖繪製到營造發包與定期工地查驗，全程陪伴工程團隊把每一個設計決策精準落實到真實場域。',
    deliverables: ['執照申請與法規審查', '全套施工圖與工程預算書', '工地放樣與關鍵節點查驗', '完工驗收與空間使用手冊']
  }
};
