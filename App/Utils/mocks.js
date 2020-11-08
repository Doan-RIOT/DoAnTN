const categories = [
  {
    id: "quan_ly",
    name: "QUẢN LÝ",
    tags: ["products", "inspirations"],
    count: 147,
    image: require("App/Assets/icons/plants.png")
  },
  {
    id: "reserver",
    name: "PHỤC VỤ",
    tags: ["products", "shop"],
    count: 16,
    image: require("App/Assets/icons/seeds.png")
  },
  {
    id: "kitchen",
    name: "QUẦY BẾP",
    tags: ["products", "inspirations"],
    count: 68,
    image: require("App/Assets/icons/flowers.png")
  },
  {
    id: "bar",
    name: "QUẦY BAR",
    tags: ["products", "shop"],
    count: 17,
    image: require("App/Assets/icons/sprayers.png")
  },
  {
    id: "shift_delivery",
    name: "TIẾP THỰC",
    tags: ["products", "shop"],
    count: 47,
    image: require("App/Assets/icons/pots.png")
  },
  {
    id: "working_shift",
    name: "TẠO NHẬN CA",
    tags: ["products", "shop"],
    count: 47,
    image: require("App/Assets/icons/fertilizers.png")
  },
  {
    id: "preprocessing",
    name: "SƠ CHẾ",
    tags: ["products", "shop"],
    count: 47,
    image: require("App/Assets/icons/fertilizers.png")
  }
];

const products = [
  {
    id: 1,
    name: "16 Best Plants That Thrive In Your Bedroom",
    description:
      "Bedrooms deserve to be decorated with lush greenery just like every other room in the house – but it can be tricky to find a plant that thrives here. Low light, high humidity and warm temperatures mean only certain houseplants will flourish.",
    tags: ["Interior", "27 m²", "Ideas"],
    images: [
      require("App/Assets/images/plants_1.png"),
      require("App/Assets/images/plants_2.png"),
      require("App/Assets/images/plants_3.png"),
      // showing only 3 images, show +6 for the rest
      require("App/Assets/images/plants_1.png"),
      require("App/Assets/images/plants_2.png"),
      require("App/Assets/images/plants_3.png"),
      require("App/Assets/images/plants_1.png"),
      require("App/Assets/images/plants_2.png"),
      require("App/Assets/images/plants_3.png")
    ]
  }
];

const explore = [
  // images
  require("App/Assets/images/explore_1.png"),
  require("App/Assets/images/explore_2.png"),
  require("App/Assets/images/explore_3.png"),
  require("App/Assets/images/explore_4.png"),
  require("App/Assets/images/explore_5.png"),
  require("App/Assets/images/explore_6.png")
];

const profile = {
  username: "Y.Le",
  location: "Da Nang",
  email: "y.le@email.com",
  avatar: require("App/Assets/images/avatar.png"),
  budget: 1000,
  monthly_cap: 5000,
  notifications: true,
  newsletter: false
};

const shiftDeliveryList = [
  {
    id: 1,
    name: "Nhân viên 1",
    amount: "500,000"
  },
  {
    id: 2,
    name: "Nhân viên 2",
    amount: "500,000"
  },

];

const tables = [
  {
    id: 1,
    name: "Bàn 1",
    status: 1,
    location: "1",
    owner: ""
  },
  {
    id: 2,
    name: "Bàn 2",
    status: 2,
    location: "1",
    owner: "Nhân Viên A"
  },
  {
    id: 3,
    name: "Bàn 3",
    status: 1,
    location: "1"
  },
  {
    id: 4,
    name: "Bàn 4",
    status: 1,
    location: "1"
  },
  {
    id: 5,
    name: "Bàn 5",
    status: 2,
    location: "2",
    owner: "Nhân Viên B"
  }
];

const order = {
  table: "1",
  owner: "Nhân viên A",
  dish: [
    {
      id: 1,
      name: "Salad dầu giấm",
      category: 1,
      count: 9,
      status: "Đợi"
    },
    {
      id: 2,
      name: "Ốc BULOT rang muối ớt",
      category: 1,
      count: 2,
      status: "Báo Bếp"
    }
  ]
};

const noteAttributes = [
  {
    text: 'Ít',
    value:'Ít:',
    color: 'pink2'
  },
  {
    text: 'Nóng',
    value:'Nóng',
    color: 'green'
  },
  {
    text: 'Hành',
    value:'Hành',
    color: 'green'
  },
  {
    text: 'Rau thơm',
    value:'Rau thơm',
    color: 'green'
  },
  {
    text: 'Nước mắm',
    value:'Nước mắm',
    color: 'green'
  },
  {
    text: 0,
    value: 0,
    color: 'primary'
  },
  {
    text: 5,
    value: 5,
    color: 'primary'
  },
  {
    text: 'Nhiều',
    value:'Nhiều:',
    color: 'pink2'
  },
  {
    text: 'Lạnh',
    value:'Lạnh',
    color: 'green'
  },
  {
    text: 'Tỏi',
    value:'Tỏi',
    color: 'green'
  },
  {
    text: 'Nước sốt',
    value:'Nước sốt',
    color: 'green'
  },
  {
    text: 'Mật ong',
    value:'Mật ong',
    color: 'green'
  },
  {
    text: 1,
    value: 1,
    color: 'primary'
  },
  {
    text: 6,
    value: 6,
    color: 'primary'
  },
  {
    text: 'Không',
    value:'Không:',
    color: 'pink2'
  },
  {
    text: 'Chua',
    value:'Chua',
    color: 'green'
  },
  {
    text: 'Tiêu',
    value:'Tiêu',
    color: 'green'
  },
  {
    text: 'Nước tương',
    value:'Nước tương',
    color: 'green'
  },
  {
    text: 'Giấm',
    value:'Giấm',
    color: 'green'
  },
  {
    text: 2,
    value: 2,
    color: 'primary'
  },
  {
    text: 7,
    value: 7,
    color: 'primary'
  },
  {
    text: 'Có',
    value:'Có:',
    color: 'pink2'
  },
  {
    text: 'Cay',
    value:'Cay',
    color: 'green'
  },
  {
    text: 'Dầu ăn',
    value:'Dầu ăn',
    color: 'green'
  },
  {
    text: 'Rượu',
    value:'Rượu',
    color: 'green'
  },
  {
    text: 'Chanh',
    value:'Chanh',
    color: 'green'
  },
  {
    text: 3,
    value: 3,
    color: 'primary'
  },
  {
    text: 8,
    value: 8,
    color: 'primary'
  },
  {
    text: '',
    value:': ',
    color: 'pink2'
  },
  {
    text: 'Mặn',
    value:'Mặn',
    color: 'green'
  },
  {
    text: 'Ớt',
    value:'Ớt',
    color: 'green'
  },
  {
    text: ',',
    value:', ',
    color: 'green'
  },
  {
    text: 'X',
    value:'X',
    color: 'green'
  },
  {
    text: 4,
    value: 4,
    color: 'primary'
  },
  {
    text: 9,
    value: 9,
    color: 'primary'
  },
]

export {
  categories,
  explore,
  products,
  profile,
  shiftDeliveryList,
  tables,
  order,
  noteAttributes
};
