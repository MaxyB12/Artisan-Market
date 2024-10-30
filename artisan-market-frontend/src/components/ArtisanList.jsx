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

const ArtisanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ArtisanCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ArtisanName = styled.h2`
  color: #2c1810;
  margin-bottom: 1rem;
  font-size: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #d4a373;
  }
`;

const ArtisanBio = styled.p`
  color: #2c1810;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ProductCard = styled.div`
  background-color: #f7f1e5;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductName = styled.h3`
  color: #2c1810;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const ProductDescription = styled.p`
  color: #2c1810;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ProductPrice = styled.span`
  color: #d4a373;
  font-weight: bold;
  font-size: 1.2rem;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #d4a373;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #e25555;
    transform: scale(1.1);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
  color: #2c1810;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #e25555;
  font-size: 1.2rem;
`;

const EcoFriendlyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #d4a373;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  svg {
    font-size: 1rem;
  }
`;

function ArtisanList() {
  const isLoggedIn = !!localStorage.getItem('token');
  const { loading, error, data } = useQuery(GET_ARTISANS);
  const [likeProduct] = useMutation(LIKE_PRODUCT);

  if (loading) return <LoadingMessage>Loading our talented artisans...</LoadingMessage>;
  if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

  const handleLike = async (productId) => {
    if (!isLoggedIn) {
      alert('Please log in to like products');
      return;
    }

    try {
      await likeProduct({
        variables: { id: productId },
        context: {
          headers: {
            authorization: localStorage.getItem('token')
          }
        },
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
    <ArtisanGrid>
      {data.artisans.map(artisan => (
        <ArtisanCard key={artisan.id}>
          <ArtisanName>{artisan.name}</ArtisanName>
          <EcoFriendlyBadge>
            <FaLeaf /> Eco-Friendly Artisan
          </EcoFriendlyBadge>
          <ArtisanBio>{artisan.bio}</ArtisanBio>
          <ProductsGrid>
            {artisan.products.map(product => (
              <ProductCard key={product.id}>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductFooter>
                  <ProductPrice>${product.price}</ProductPrice>
                  <LikeButton onClick={() => handleLike(product.id)}>
                    <FaHeart /> {product.likes}
                  </LikeButton>
                </ProductFooter>
              </ProductCard>
            ))}
          </ProductsGrid>
        </ArtisanCard>
      ))}
    </ArtisanGrid>
  );
}

export default ArtisanList;