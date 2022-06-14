// simulate getting products from DataBase
const products = [
  { name: "Apples", country: "Italy", cost: 3, inStock: 10 },
  { name: "Oranges", country: "Spain", cost: 4, inStock: 3 },
  { name: "Beans", country: "USA", cost: 2, inStock: 5 },
  { name: "Cabbage", country: "USA", cost: 1, inStock: 8 },
];

//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          //result.data.data;
          dispatch({ type: "FETCH_SUCCESS", payload: result.data.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

//-----------Parent Component for App--------------------
const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;

  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  
  // Fetch Data
  const addToCart = (e) => {
    
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);

    if (item[0]['inStock'] == 0) return;
    item[0].inStock = item[0]['inStock'] - 1;
    console.log(`add to cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    /*
    let inStockNum = item[0]['inStock'];
    if (inStockNum >= 1) {
      //console.log(`add to Cart ${JSON.stringify(item)}`);
      item[0]['inStock'] = item[0]['inStock'] - 1;
      //console.log("inStock" + item[0]["inStock"]);
      setCart([...cart, ...item]);
      doFetch(query);
    }else if (inStockNum <= 0) {
      console.log(`${name}s are out of stock`);
      e.target.disabled = true;
    }
    */
    
    
  };

  const deleteCartItem = (delIndex) => {
    //delIndex is the index of the items in the cart
    let newCart = cart.filter((item, i) => delIndex != i);
    let target = cart.filter((item, index) => delIndex == index);
    let newItems = items.map((item, index) => {
      if (item.name == target[0].name) item.inStock = item.inStock + 1;
      return item;
    });
    setCart(newCart);
    setItems(newItems);
  };

  let list = items.map((item, index) => {
    let n = index + 1049;
    let url = "https://picsum.photos/id/" + n + "/50/50";
    console.log(`inStock:` + item['inStock']);

    return (
      <li key={index}>
        <Image src={url} width={70} roundedCircle></Image>
        <Button variant="light" size="large">
          {item.name}: ${item.cost}, {item.inStock} in stock
        </Button>
        <input name={item.name} inStock={item.inStock} type="submit" onClick={addToCart}></input>
      </li>
    );
  });


  let cartList = cart.map((item, index) => {
    return (
      <Card key={index}>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
            {item.name}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse
          onClick={() => deleteCartItem(index)}
          eventKey={1 + index}
        >
          <Card.Body>
            $ {item.cost} from {item.country} <Button>remove</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  });


  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };


  // TODO: implement the restockProducts function
  const restockProducts = (url) => {
    doFetch(url);
    console.log(`>>>>>>>>>` + data);
    let newItems = data.map((item) => {
      //data is an array of objects, each object in the array includes an attributes object, item is the object, attributes is the object containing name, country, cost, inStock
      console.log(item['attributes']['name']);
      let {name, country, cost, inStock} = item['attributes'];
      return {name, country, cost, inStock};
    });
    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(query);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};


// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
