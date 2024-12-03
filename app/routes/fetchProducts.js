// import { shopify } from '../shopify.server';

export async function fetchActiveProducts(session) {
  const query = `
    query {
      products(first: 50, query: "status:active") {
        edges {
          node {
            id
            title
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopify.api.graphql({ session, query });
    const products = response.data.products.edges.map((edge) => ({
      label: edge.node.title,
      value: edge.node.id,
      variants: edge.node.variants.edges.map((variantEdge) => ({
        label: variantEdge.node.title,
        value: variantEdge.node.id,
      })),
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products via GraphQL:', error);
    throw error;
  }
}
