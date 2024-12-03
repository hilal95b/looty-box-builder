import { useEffect, useState, useCallback, Fragment } from "react";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
	Page,
	Layout,
	Text,
	Card,
	Button,
	Select,
	BlockStack,
	Box,
	List,
	Link,
	InlineStack,
	TextField,
	FormLayout,
	InlineGrid,
	Popover,
	LegacyStack,
	Divider,
	Thumbnail,
	Frame,
	ContextualSaveBar,
} from "@shopify/polaris";

import { InfoIcon } from '@shopify/polaris-icons';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import SelectionProductsForm from "../components/selectionProductsForm";

export const loader = async ({ request }) => {
	await authenticate.admin(request);

	return null;
};

export const action = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	const color = ["Red", "Orange", "Yellow", "Green"][
		Math.floor(Math.random() * 4)
	];
	const response = await admin.graphql(
		`#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
		{
			variables: {
				input: {
					title: `${color} Snowboard`,
				},
			},
		},
	);
	const responseJson = await response.json();
	const product = responseJson.data.productCreate.product;
	const variantId = product.variants.edges[0].node.id;
	const variantResponse = await admin.graphql(
		`#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
		{
			variables: {
				productId: product.id,
				variants: [{ id: variantId, price: "100.00" }],
			},
		},
	);
	const variantResponseJson = await variantResponse.json();

	return json({
		product: responseJson.data.productCreate.product,
		variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
	});
};

export default function CreateForm() {

	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [type, setType] = useState('single');
	const [boxInclude, setBoxInclude] = useState('2');

	const handleSelectType = useCallback(
		(value) => setType(value),
		[],
	);

	const handleBoxInclude = useCallback(
		(value) => setBoxInclude(value),
		[],
	);

	const typeOptions = [
		{ label: 'Single product Type', value: 'single' },
		{ label: 'Multible product Type', value: 'multible' },
	];

	const boxIncludeOptions = [
		{ label: '2', value: '2' },
		{ label: '3', value: '3' },
		{ label: '4', value: '4' },
		{ label: '5', value: '5' },
		{ label: '6', value: '6' },
	];

	const togglePopoverActive = useCallback(
		() => setPopoverActive((popoverActive) => !popoverActive),
		[],
	);

	const fetcher = useFetcher();
	const shopify = useAppBridge();
	const isLoading =
		["loading", "submitting"].includes(fetcher.state) &&
		fetcher.formMethod === "POST";
	const productId = fetcher.data?.product?.id.replace(
		"gid://shopify/Product/",
		"",
	);

	useEffect(() => {
		if (productId) {
			shopify.toast.show("Product created");
		}
	}, [productId, shopify]);
	const generateProduct = () => fetcher.submit({}, { method: "POST" });

	return (
		<Page
			title="Create Bundel"
			backAction={{ content: 'app', url: '/app' }}
			primaryAction={{content: 'Save Bundel', disabled: false}}
		>
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<Card>
							<FormLayout>
								<BlockStack gap="200">
									<Text as="label" variant="headingMd">
										Bundel Name
									</Text>
									<TextField value={name} placeholder="I Love You Box" error={false} requiredIndicator />
									<Text variant="bodyMd" as="p">
										This will appear as "Product Name" in Admin and Storefront
									</Text>
								</BlockStack>
								<BlockStack gap="200">
									<InlineGrid gap="400" columns={2}>
										<Select
											label="Selection type"
											options={typeOptions}
											onChange={handleSelectType}
											value={type}
											requiredIndicator
										/>
										<Select
											label="Bundel Items Include"
											options={boxIncludeOptions}
											onChange={handleBoxInclude}
											value={boxInclude}
											requiredIndicator
										/>
									</InlineGrid>
								</BlockStack>
								<BlockStack>
									<TextField
										type="number"
										label="Bundel Fixed Price"
										value={price}
										onChange={setPrice}
										autoComplete="off"
										prefix="JOD"
										placeholder="0.00"
										min={0}
										error={false}
										requiredIndicator
									/>
								</BlockStack>
								<BlockStack gap="200">
									<Text as="p" variant="bodyMd">Set product description and images after creating the bundle product.</Text>
								</BlockStack>
							</FormLayout>
						</Card>
						<br />
						{
							type === 'single' ?
								<SelectionProductsForm itemCount={boxInclude} boxType={type} /> :
								<SelectionProductsForm itemCount={1} boxType={type} />

						}
					</Layout.Section>
					<Layout.Section variant="oneThird">
						<BlockStack gap="500">
							<Card>
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										App template specs
									</Text>
									<BlockStack gap="200">
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												Framework
											</Text>
											<Link
												url="https://remix.run"
												target="_blank"
												removeUnderline
											>
												Remix
											</Link>
										</InlineStack>
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												Database
											</Text>
											<Link
												url="https://www.prisma.io/"
												target="_blank"
												removeUnderline
											>
												Prisma
											</Link>
										</InlineStack>
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												Interface
											</Text>
											<span>
												<Link
													url="https://polaris.shopify.com"
													target="_blank"
													removeUnderline
												>
													Polaris
												</Link>
												{", "}
												<Link
													url="https://shopify.dev/docs/apps/tools/app-bridge"
													target="_blank"
													removeUnderline
												>
													App Bridge
												</Link>
											</span>
										</InlineStack>
										<InlineStack align="space-between">
											<Text as="span" variant="bodyMd">
												API
											</Text>
											<Link
												url="https://shopify.dev/docs/api/admin-graphql"
												target="_blank"
												removeUnderline
											>
												GraphQL API
											</Link>
										</InlineStack>
									</BlockStack>
								</BlockStack>
							</Card>
							<Card>
								<BlockStack gap="200">
									<Text as="h2" variant="headingMd">
										Next steps
									</Text>
									<List>
										<List.Item>
											Build an{" "}
											<Link
												url="https://shopify.dev/docs/apps/getting-started/build-app-example"
												target="_blank"
												removeUnderline
											>
												{" "}
												example app
											</Link>{" "}
											to get started
										</List.Item>
										<List.Item>
											Explore Shopify’s API with{" "}
											<Link
												url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
												target="_blank"
												removeUnderline
											>
												GraphiQL
											</Link>
										</List.Item>
									</List>
								</BlockStack>
							</Card>
						</BlockStack>
					</Layout.Section>
				</Layout>
			</BlockStack>
		</Page>
	);
}


