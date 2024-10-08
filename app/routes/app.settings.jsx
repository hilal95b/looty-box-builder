import {
	BlockStack,
	Box,
	Button,
	Card,
	InlineGrid,
	Page,
	Text,
	TextField,
	ButtonGroup,
	CalloutCard,
} from "@shopify/polaris";
import React, { useState } from 'react';
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";

export async function loader() {
	// get data from Database
	let settings = {
		name: 'My App',
		description: 'My app description'
	}
	return json(settings);
}

export async function action({ request }) {
	let settings = await request.formData();
	settings = Object.fromEntries(settings);

	return json(settings)
}

export default function SettingsPage() {

	const settings = useLoaderData();
	const [ formState, setFormState ] = useState({settings}); 

	return (
		<Page
			divider
		>
			<TitleBar title="Settings" />
			<BlockStack gap={{ xs: "800", sm: "400" }}>
				<InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
					<Box
						as="section"
						paddingInlineStart={{ xs: 400, sm: 0 }}
						paddingInlineEnd={{ xs: 400, sm: 0 }}
					>
						<BlockStack gap="400">
							<Text as="h3" variant="headingMd">
								Setting
							</Text>
							<Text as="p" variant="bodyMd">
								Update app settings and prefrances
							</Text>
						</BlockStack>
					</Box>
					<Card roundedAbove="sm">
						<Form method="POST">
							<BlockStack gap="400">
								<TextField name="name" label="App Name" value={formState.name} onChange={(value) => setFormState({ ...formState, name: value })} />
								<TextField name="description" label="Description" value={formState.description} onChange={(value) => setFormState({ ...formState, description: value })} />
								<ButtonGroup>
									<Button size="large" submit={true} variant="primary">Save</Button>
								</ButtonGroup>
							</BlockStack>
						</Form>
					</Card>
				</InlineGrid>

				<InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
					<Box
						as="section"
						paddingInlineStart={{ xs: 400, sm: 0 }}
						paddingInlineEnd={{ xs: 400, sm: 0 }}
					>
						<BlockStack gap="400">
							<Text as="h3" variant="headingMd">
								Design And Style
							</Text>
							<Text as="p" variant="bodyMd">
								Customize User Journey
							</Text>
						</BlockStack>
					</Box>
					<CalloutCard
						title="Customize the style of user journey"
						illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
						primaryAction={{
							content: 'Customize User Journey',
							url: '#',
						}}
						>
						<p>Upload your store’s logo, change colors and fonts, screens and more.</p>
					</CalloutCard>
				</InlineGrid>


			</BlockStack>
		</Page>
	);
}
