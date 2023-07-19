import React, { useState, useEffect } from 'react';
import './Estilo.css';

const Carrinho = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=8')
      .then(response => response.json())
      .then(data => {
        const produtosData = data.map(item => ({
          id: item.id,
          nome: item.title,
          preco: item.price,
          quantidade: 0,
          imagem: item.image,
          descricao: item.description,
        }));
        setProdutos(produtosData);
      })
      .catch(error => {
        console.log('Ocorreu um erro ao carregar os produtos:', error);
      });
  }, []);

  useEffect(() => {
    const carrinhoData = JSON.parse(localStorage.getItem('carrinho'));
    if (carrinhoData && carrinhoData.produtos) {
      setProdutos(prevProdutos =>
        prevProdutos.map(produto => {
          const carrinhoProduto = carrinhoData.produtos.find(
            item => item.id === produto.id
          );
          return carrinhoProduto ? { ...produto, quantidade: carrinhoProduto.quantidade } : produto;
        })
      );
    }
  }, []);

  useEffect(() => {
    const carrinhoData = { produtos };
    localStorage.setItem('carrinho', JSON.stringify(carrinhoData));
  }, [produtos]);

  const incrementarQuantidade = (id) => {
    setProdutos(prevProdutos => {
      return prevProdutos.map(produto => {
        if (produto.id === id) {
          return { ...produto, quantidade: produto.quantidade + 1 };
        }
        return produto;
      });
    });
  };

  const decrementarQuantidade = (id) => {
    setProdutos(prevProdutos => {
      return prevProdutos.map(produto => {
        if (produto.id === id && produto.quantidade > 0) {
          return { ...produto, quantidade: produto.quantidade - 1 };
        }
        return produto;
      });
    });
  };

  const calcularTotal = () => {
    let total = 0;
    produtos.forEach(produto => {
      total += produto.preco * produto.quantidade;
    });
    return total;
  };

  return (
    <div className="container">
      <h1>Carrinho de Compra</h1>
      <ul>
        {produtos.map(produto => (
          <li key={produto.id} className="product-item">
            <img src={produto.imagem} alt={produto.nome} className="product-image" />
            <div className="product-details">
              <h3 className="product-name">{produto.nome}</h3>
              <p className="product-description">{produto.descricao}</p>
              <p className="product-price">Preço: R$ {produto.preco.toFixed(2)}</p><br></br><br></br>
            </div>
            <button onClick={() => decrementarQuantidade(produto.id)}>-</button>
            <span>{produto.quantidade}</span>
            <button onClick={() => incrementarQuantidade(produto.id)}>+</button>
          </li>
        ))}
      </ul><br></br>
      <h2 className="Total">TOTAL: R$ {calcularTotal().toFixed(2)}</h2>
    </div>
  );
};

export default Carrinho;







