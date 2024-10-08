import React from 'react';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import { FaLeaf } from 'react-icons/fa';

const GET_ARTISANS = gql`
  query GetArtisans {
    artisans {
      id
      name
      bio
      products {
        id
        name
        price
      }
    }
  }
`;

const ArtisanListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ArtisanCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.3s;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 800px;

  &:hover {
    transform: translateY(-5px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, #d4a373, #2c1810);
  }
`;

const ArtisanName = styled.h2`
  color: #2c1810;
  border-bottom: 2px dashed #d4a373;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ProductItem = styled.li`
  margin-bottom: 1rem;
  font-style: italic;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-weight: bold;
  color: #d4a373;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #d4a373;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #e25555;
`;

const ArtisanBio = styled.p`
  font-style: italic;
  color: #5a4034;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProductHeading = styled.h3`
  color: #2c1810;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

function ArtisanList() {
  const { loading, error, data } = useQuery(GET_ARTISANS);

  if (loading) return <LoadingMessage>Loading our talented artisans...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

  return (
    <ArtisanListContainer>
      <h1>Our Talented Artisans</h1>
      {data.artisans.map(artisan => (
        <ArtisanCard key={artisan.id}>
          <ArtisanName>{artisan.name}</ArtisanName>
          <ArtisanBio>{artisan.bio}</ArtisanBio>
          <ProductHeading>
            <FaLeaf /> Handcrafted Products
          </ProductHeading>
          <ProductList>
            {artisan.products.map(product => (
              <ProductItem key={product.id}>
                <span>{product.name}</span>
                <Price>${product.price}</Price>
              </ProductItem>
            ))}
          </ProductList>
        </ArtisanCard>
      ))}
    </ArtisanListContainer>
  );
}

export default ArtisanList;