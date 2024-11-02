import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client'; // Added useMutation
import styled from 'styled-components';
import { FaLeaf, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LIKE_PRODUCT = gql`
  mutation LikeProduct($id: ID!) {
    likeProduct(id: $id) {
      id
      likes
    }
  }
`;

const GET_ARTISANS = gql`
  query GetArtisans {
    artisans {
      id
      name
      bio
      Products {
        id
        name
        description
        price
        likes
      }
    }
  }
`;

function ArtisanList() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ARTISANS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('Query completed. Data received:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Add like mutation hook
  const [likeProduct] = useMutation(LIKE_PRODUCT, {
    update(cache, { data: { likeProduct } }) {
      const { artisans } = cache.readQuery({ query: GET_ARTISANS });
      cache.writeQuery({
        query: GET_ARTISANS,
        data: {
          artisans: artisans.map(artisan => ({
            ...artisan,
            Products: artisan.Products.map(product =>
              product.id === likeProduct.id
                ? { ...product, likes: likeProduct.likes }
                : product
            )
          }))
        }
      });
    }
  });

  // Add handle like function
  const handleLike = async (productId) => {
    try {
      await likeProduct({
        variables: { id: productId }
      });
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  console.log('Current state:', { loading, error, data });

  if (loading) {
    return <LoadingContainer>Loading artisans...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error: {error.message}</ErrorContainer>;
  }

  if (!data || !data.artisans || data.artisans.length === 0) {
    return <EmptyContainer>No artisans found</EmptyContainer>;
  }

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
            {artisan.Products && artisan.Products.map(product => (
              <ProductCard key={product.id}>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductFooter>
                  <ProductPrice>${product.price}</ProductPrice>
                  <LikeButton onClick={() => handleLike(product.id)}>
                    <FaHeart /> {product.likes || 0}
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

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
  color: #2c1810;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff0000;
  font-size: 1.2rem;
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #2c1810;
  font-size: 1.2rem;
`;

const ArtisanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background-color: #f7f1e5;
`;

const ArtisanCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ArtisanName = styled.h2`
  color: #2c1810;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-family: 'Amatic SC', cursive;
`;

const EcoFriendlyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #d4a373;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  svg {
    color: #98c1d9;
  }
`;

const ArtisanBio = styled.p`
  color: #5c5c5c;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  background: #fefae0;
  padding: 1.5rem;
  border-radius: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ProductName = styled.h3`
  color: #2c1810;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Amatic SC', cursive;
`;

const ProductDescription = styled.p`
  color: #5c5c5c;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductPrice = styled.span`
  color: #2c1810;
  font-weight: bold;
  font-size: 1.1rem;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #d4a373;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: #e76f51;
  }

  svg {
    font-size: 1.2rem;
  }
`;

export default ArtisanList;