import { useState, Fragment, useEffect } from "react";
import {
	Text,
	Card,
	Button,
	BlockStack,
	InlineStack,
	TextField,
	LegacyStack,
	Divider,
	Thumbnail,
} from "@shopify/polaris";

const SelectionProductsForm = ({ itemCount, boxType }) => {

	const [formState, setFormState] = useState([]);
	const [productList, setProductList] = useState([]);
	const [totalVariants, setTotalVariants] = useState(0);

		// [START select-product]
		async function selectProduct() {
			const products = await window.shopify.resourcePicker({
				type: "product",
				action: "add", // customized action verb, either 'select' or 'add',
				multiple: true,
			});
	
			if (products && products.length > 0) {
				// Extract relevant details for each product
				const productDetails = products.map(({ images, id, variants, title, handle }) => ({
					productId: id,
					productVariantId: variants[0].id,
					productTitle: title,
					productHandle: handle,
					productAlt: images[0]?.altText,
					productVariantPrice: variants[0]?.price,
					productImage: images[0]?.originalSrc,
				}));
		
				// Update both productList and formState with the full list
				setProductList(products);
				setFormState(productDetails);
			}
		}

		useEffect(() => {
			console.log('formState', formState);
			console.log('productList', productList);
			if (productList && productList.length > 0) {
				// Calculate the total number of variants across all products
				const variantsCount = productList.reduce((acc, product) => {
					return acc + (product.variants ? product.variants.length : 0);
				}, 0);
	
				// Update the state with the total variant count
				setTotalVariants(variantsCount);
			}
		}, [productList]);
	

	return (
		<Fragment>
			{Array.from({ length: Number(itemCount) }, (_, index) => index + 1).map((item) =>
				<LegacyStack vertical key={item}>
					{
						boxType === 'single' &&
						<BlockStack gap="100">
							<Text as="h3" variant="headingLg">
								Bundel Selection {item} {/* item will now be treated as a number */}
							</Text>
							<Text variant="bodyLg" as="p" alignment="start">
								A step is a group of products where your customers can make a selection {item}.
							</Text>
						</BlockStack>
					}

					<Card>
						<BlockStack gap="400">
							<TextField
								type="text"
								label="Selection Title"
								value={''}
								onChange={''}
								autoComplete="off"
								error={false}
								requiredIndicator
							/>
							<TextField
								label="Short Subtitle"
								value={''}
								onChange={''}
								multiline={2}
								autoComplete="off"
							/>
							<br />
							<BlockStack gap="400">
								<InlineStack align="space-between">
									<Text variant="headingMd" as="h4">
										Selected products.
									</Text>
									{
										formState.length > 0 &&
										<Button variant="primary" onClick={selectProduct}>Change product</Button>
									}
								</InlineStack>
								{
									formState.length > 0 ?

										<BlockStack gap={200}>
											{
												productList?.map((product, idx) => (
													<BlockStack gap="200">
														<InlineStack gap="500" blockAlign="start">
															<Thumbnail
																source={product.images[0].originalSrc || ImageIcon}
																alt={formState.productAlt}
																size="large"
															/>
															<BlockStack gap="600">
																<Text as="span" variant="headingMd" fontWeight="semibold">
																	{product.title}
																</Text>
																{
																	product.variants.map((variant, idx) => (
																		<BlockStack>
																			<InlineStack gap={300}>
																				<Thumbnail
																					source={variant.image.originalSrc || ImageIcon}
																					alt={formState.productAlt}
																					size="small"																				/>
																				<BlockStack gap={100}>
																					<Text tone="" as="span" variant="headingMd" fontWeight="medium">
																						{product.options[0].values[idx]}
																					</Text>
																					<Text as="span" variant="headingMd" fontWeight="regular">
																						{variant.price} JOD
																					</Text>
																				</BlockStack>
																			</InlineStack>
																		</BlockStack>
																	))
																}
															</BlockStack>


														</InlineStack>
														<Divider />
													</BlockStack>
												))
											}


										</BlockStack>

										:

										<Card>
											<BlockStack gap="200">
												<Text variant="headingMd" as="h4" alignment="center">
													No products selected
												</Text>
												<Text variant="bodymd" as="p" alignment="center">
													Add products for customers to choose in this step
												</Text>
												<InlineStack align="center">
													<Button onClick={selectProduct} id="select-product" variant="primary">Select Product</Button>
												</InlineStack>
											</BlockStack>
										</Card>
								}
								<InlineStack direction="row-reverse">
									<Text>{totalVariants} / 400 variants</Text>
								</InlineStack>
							</BlockStack>
						</BlockStack>
					</Card>
					<br />
				</LegacyStack>

			)}
		</Fragment>
	)
}

export default SelectionProductsForm
