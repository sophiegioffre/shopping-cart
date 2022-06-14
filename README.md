# shopping-cart

## Description
Basic grocery store shopping cart app that allows you to move items from the stock list to your shopping cart while updating how many of each item is in stock in real time.

## How To Use 
Clone standalone.html and navBarButton3.jsx files. In the terminal, navigate to the directory that houses these files and use the command http-server -c-1. Open browser to localhost:8080. 
OR
Clone index.html and cart.jsx files. In the terminal, navigate to the directory housing these files and run http-server -c-1. Open another terminal window, and run the following commands: mkdir cartDB; cd cartDB; npx create-strapi-app@latest cartDB --quickstart. This will take you to a login for Strapi. Follow along with Strapi quide to create an API/collection type called product with collection type fields {name, country, cost, inStock}. This will allow you to use the restock function. 

## Roadmap to Future Improvements
-improve styling

## License
MIT License
