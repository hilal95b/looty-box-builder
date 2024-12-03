export async function fetchAddOns(session) {
	const query = `
	  query {
		products(first: 20, query: "tag:add-on") {
		  edges {
			node {
			  id
			  title
			  priceRangeV2 {
				maxVariantPrice {
				  amount
				}
			  }
			}
		  }
		}
	  }
	`;
  
	try {
	  const response = await shopify.api.graphql({ session, query });
	  const addOns = response.data.products.edges.map((edge) => ({
		label: `${edge.node.title} (+${edge.node.priceRangeV2.maxVariantPrice.amount} JOD)`,
		value: edge.node.id,
	  }));
  
	  return addOns;
	} catch (error) {
	  console.error('Error fetching add-ons via GraphQL:', error);
	  throw error;
	}
  }
  