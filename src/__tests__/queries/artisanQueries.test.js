import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { GET_ARTISANS_AND_PRODUCTS } from '../../queries/artisanQueries';

const mocks = [
  {
    request: {
      query: GET_ARTISANS_AND_PRODUCTS
    },
    result: {
      data: {
        artisans: [
          { id: '1', name: 'Test Artisan', bio: 'Test Bio' }
        ],
        products: [
          { 
            id: '1', 
            name: 'Test Product', 
            price: 99.99,
            artisan: { id: '1', name: 'Test Artisan' }
          }
        ]
      }
    }
  }
];

describe('Artisan Queries', () => {
  test('GET_ARTISANS_AND_PRODUCTS query', async () => {
    const TestComponent = () => {
      const { loading, error, data } = useQuery(GET_ARTISANS_AND_PRODUCTS);
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error!</div>;
      return <div data-testid="data">{data.artisans[0].name}</div>;
    };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TestComponent />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('data')).toHaveTextContent('Test Artisan');
    });
  });
});