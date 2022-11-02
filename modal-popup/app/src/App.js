import React from "react";
import logo from "./logo.svg";

import axios from "axios";

import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";

function 상품정보(props) {
  const { item, 모달창열기, 상품액션, text, 버튼 } = props;

  return (
    <div className="item">
      <div className="item-block">
        <div className="image-area">
          <img
            onClick={모달창열기.bind(this, item)}
            src={item.image}
            alt="상품이미지"
            className="image"
          />
        </div>
        <div className="name">{item.name}</div>
        <div className="description">{item.descrition}</div>
        <div className="bottom-area">
          <div className="price">{item.price}</div>
          <div className="button" onClick={상품액션.bind(this, item)}>
            <p>{text}</p>
            {/* <버튼/> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = React.useState([
    {
      name: "Nike CruzrOne",
      image:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/cruzrone-unisex-shoe-T2rRwS-removebg-preview.png",
      descrition:
        "Designed for steady, easy-paced movement, the Nike CruzrOne keeps you going. Its rocker-shaped sole and plush, lightweight cushioning let you move naturally and comfortably. The padded collar is lined with soft wool, adding luxury to every step, while mesh details let your foot breathe. There’s no finish line—there’s only you, one step after the next.",
      price: "20000",
    },
    {
      name: "Nike Epic React Flyknit 2",
      image:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/epic-react-flyknit-2-mens-running-shoe-2S0Cn1-removebg-preview.png",
      descrition:
        "Designed for steady, easy-paced movement, the Nike CruzrOne keeps you going. Its rocker-shaped sole and plush, lightweight cushioning let you move naturally and comfortably. The padded collar is lined with soft wool, adding luxury to every step, while mesh details let your foot breathe. There’s no finish line—there’s only you, one step after the next.",
      price: "20000",
    },
  ]);

  const [myCart, setMyCart] = React.useState([]);

  const [showModal, setShowModal] = React.useState({
    show: false,
    image: null,
  });

  const 서버에있는장바구니가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/myCart",
    })
      .then((response) => {
        setMyCart(response.data);
      })
      .catch((e) => {});
  };

  React.useEffect(() => {
    서버에있는장바구니가져오기();
  }, []);

  React.useEffect(() => {
    window.addEventListener("click", (event) => {
      if (event.target.className === "modal-bg") {
        const cloneShowModal = { ...showModal };
        cloneShowModal.show = false;
        cloneShowModal.image = null;
        setShowModal(cloneShowModal);
      }
    });
  }, []);

  // React => useMemo
  const 총금액 = React.useMemo(() => {
    let 금액 = 0;

    myCart.forEach((item) => {
      금액 += parseInt(item.price);
    });

    return 금액;
  }, [myCart]);

  const 모달창열기 = (item) => {
    const cloneShowModal = { ...showModal };
    cloneShowModal.show = true;
    cloneShowModal.image = item.image;
    setShowModal(cloneShowModal);
  };

  const 상품장바구니에담기 = async (item) => {
    // myCart 배열에 똑같은 상품이 있는지 확인
    // 똑같은 상품있으면 push X
    const cloneMyCart = [...myCart];

    const 이미가지고있는상품 = cloneMyCart.find((myItem) => {
      return myItem.name === item.name;
    });

    if (이미가지고있는상품) {
      alert("이미 해당 상품을 가지고 있습니다");
      return;
    }

    cloneMyCart.push(item);
    setMyCart(cloneMyCart);

    //비동기 -> 동기로 (async, await 세트~)
    await axios({
      method: "get",
      dataType: "json",
      url: "http://localhost:4000/add/cart",
      params: item,
    })
      .then((res) => {
        //요청 성공 했을 때
      })
      .catch((e) => {
        //서버 요청 에러
        console.log(e);
      });
  };

  const 장바구니상품삭제 = async (item) => {
    const cloneMyCart = [...myCart];
    const newMyCart = cloneMyCart.filter((myItem) => {
      return myItem.name !== item.name;
    });
    setMyCart(newMyCart);

    await axios({
      method: "get",
      dataType: "json",
      url: "http://localhost:4000/delete/cart",
      params: item,
    })
      .then((res) => {
        //요청 성공 했을 때
      })
      .catch((e) => {
        //서버 요청 에러
        console.log(e);
      });
  };

  return (
    <div className="App">
      {/* <button onClick={서버요청테스트} style={{ padding: 100 }}>
        서버 요청 테스트 !!
      </button> */}
      <div className="wrapper">
        <div className="screen -left">
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png"
            className="logo"
            alt="로고"
          />
          <div className="title">Picked items</div>
          <div className="shop-items">
            {products &&
              products.map((item, index) => {
                return (
                  <상품정보
                    key={`product-${index}`}
                    item={item}
                    모달창열기={모달창열기}
                    상품액션={상품장바구니에담기}
                    text="ADD TO CART"
                    // 버튼={() => {
                    //   return <p>ADD TO CART</p>;
                    // }}
                  />
                );
              })}
          </div>
        </div>

        <div className="screen -right">
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png"
            className="logo"
            alt="로고"
          />
          <div className="title">Your Cart</div>
          <div className="shop-items">
            {myCart ? (
              myCart.map((item, index) => {
                return (
                  <상품정보
                    key={`product-${index}`}
                    item={item}
                    모달창열기={모달창열기}
                    상품액션={장바구니상품삭제}
                    text="REMOVE"
                    // 버튼={() => {
                    //   return (
                    //     <p style={{ color: "#FFF", backgroundColor: "red" }}>
                    //       REMOVE
                    //     </p>
                    //   );
                    // }}
                  />
                );
              })
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 300,
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                없습니다.
              </div>
            )}
          </div>
        </div>
        <h3>Total Cost : {총금액}</h3>
      </div>

      {showModal.show && (
        <>
          <div className="modal-bg" />
          <div className="modal">
            <img src={showModal.image} alt="확대사진" />
          </div>
        </>
      )}
    </div>
  );
}
function Main() {
  const { loginUser } = React.useContext(StoreContext);
  return <div>메인페이지</div>;
}

function Sub() {
  const navigation = useNavigate();

  return (
    <div>
      서브페이지
      <div
        onClick={() => {
          navigation("/");
        }}
      >
        메인페이지로 이동
      </div>
    </div>
  );
}
/**
 * 모든 페이지에서 사용해야하는 데이터는 어떻게 선언?
 * 각 컴포넌트 마다 props(효율성) 안쓰고 전역변수로 쓸 수 있음
 * useContext(전역변수) 순수 리액트
 * - Redux, Recoil 라이브러리 있음
 */

const StoreContext = React.createContext({});

function Test() {
  const [loginUser, setLoginUser] = React.useState({
    id: "asd",
    name: "lee",
    age: "26",
  });

  return (
    <StoreContext.Provider value={{ loginUser }}>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/sub" element={<Sub />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default Test;
