import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import styled from 'styled-components';
import { FaLeaf, FaHeart } from 'react-icons/fa';

const GET_ARTISANS = gql`
  query GetArtisans {
    artisans {
      id
      name
      bio
      products {
        id
        name
        description
        price
        likes
      }
    }
  }
`;

const LIKE_PRODUCT = gql`
  mutation LikeProduct($id: ID!) {
    likeProduct(id: $id) {
      id
      likes
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
  width: 100%;
  max-width: 800px;
`;

const ArtisanName = styled.h2`
  color: #2c1810;
  border-bottom: 2px dashed #d4a373;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ArtisanBio = styled.p`
  font-style: italic;
  color: #5a4034;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ProductItem = styled.li`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f9f5f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.span`
  font-weight: bold;
  color: #2c1810;
`;

const ProductDescription = styled.span`
  font-size: 0.9em;
  color: #5a4034;
`;

const Price = styled.span`
  font-weight: bold;
  color: #d4a373;
`;

const LikeButton = styled.button`
  background-color: #d4a373;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c38e5f;
  }
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

function ArtisanList() {
  const { loading, error, data } = useQuery(GET_ARTISANS);
  const [likeProduct] = useMutation(LIKE_PRODUCT);

  if (loading) return <LoadingMessage>Loading our talented artisans...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

  const handleLike = async (productId) => {
    try {
      await likeProduct({
        variables: { id: productId },
        optimisticResponse: {
          likeProduct: {
            __typename: 'Product',
            id: productId,
            likes: data.artisans
              .flatMap(artisan => artisan.products)
              .find(product => product.id === productId).likes + 1,
          },
        },
        update: (cache, { data: { likeProduct } }) => {
          const existingArtisans = cache.readQuery({ query: GET_ARTISANS });
          const updatedArtisans = existingArtisans.artisans.map(artisan => ({
            ...artisan,
            products: artisan.products.map(product =>
              product.id === likeProduct.id ? { ...product, likes: likeProduct.likes } : product
            ),
          }));
          cache.writeQuery({
            query: GET_ARTISANS,
            data: { artisans: updatedArtisans },
          });
        },
      });
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

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
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  <Price>${product.price.toFixed(2)}</Price>
                </ProductInfo>
                <LikeButton onClick={() => handleLike(product.id)}>
                  <FaHeart /> {product.likes}
                </LikeButton>
              </ProductItem>
            ))}
          </ProductList>
        </ArtisanCard>
      ))}
    </ArtisanListContainer>
  );
}

export default ArtisanList;