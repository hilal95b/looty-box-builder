// new import
import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Thumbnail,
  Text,
  Icon,
  InlineStack,
} from "@shopify/polaris";

// import { getQRCodes } from "../models/QRCode.server";
import { AlertDiamondIcon, ImageIcon } from "@shopify/polaris-icons";
import { Fragment } from "react";

// [START loader]
export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  // const bundels = await getQRCodes(session.shop, admin.graphql);
  const bundels = [];

  return json({
    bundels,
  });
}
// [END loader]

// [START empty]
const EmptyBundelState = ({ onAction }) => (
  <EmptyState
    heading="No bundles found"
    action={{
      content: "Create bundle",
      onAction,
    }}
    secondaryAction={{
      content: 'Learn more',
      url: 'https://help.shopify.com',
    }}
    image="/empty-state.svg"
    fullWidth
  >
    <p>Allow customers composes the bundle by choosing from the products and associated variants.</p>
  </EmptyState>
);
// [END empty]

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

// [START table]
const BundelsTable = ({ bundels }) => (
  <IndexTable
    resourceName={{
      singular: "QR code",
      plural: "QR codes",
    }}
    itemCount={bundels.length}
    headings={[
      { title: "Thumbnail", hidden: true },
      { title: "Title" },
      { title: "Product" },
      { title: "Date created" },
      { title: "Scans" },
    ]}
    selectable={false}
  >
    {bundels.map((bundel) => (
      <BundeleRow key={bundel.id} bundel={bundel} />
    ))}
  </IndexTable>
);
// [END table]

// [START row]
const BundeleRow = ({ bundel }) => (
  <IndexTable.Row id={bundel.id} position={bundel.id}>
    <IndexTable.Cell>
      <Thumbnail
        source={bundel.productImage || ImageIcon}
        alt={bundel.productTitle}
        size="small"
      />
    </IndexTable.Cell>
    <IndexTable.Cell>
      {/* <Link to={`qrcodes/${bundel.id}`}>{truncate(bundel.title)}</Link> */}
    </IndexTable.Cell>
    <IndexTable.Cell>
      {/* [START deleted] */}
      {bundel.productDeleted ? (
        <InlineStack align="start" gap="200">
          <span style={{ width: "20px" }}>
            <Icon source={AlertDiamondIcon} tone="critical" />
          </span>
          <Text tone="critical" as="span">
            Bundel has been deleted
          </Text>
        </InlineStack>
      ) : (
        truncate(bundel.productTitle)
      )}
      {/* [END deleted] */}
    </IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(bundel.createdAt).toDateString()}
    </IndexTable.Cell>
    <IndexTable.Cell>{bundel.scans}</IndexTable.Cell>
  </IndexTable.Row>
);
// [END row]

export default function Index() {

  const { bundels } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page
      title="Bundles"
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {bundels.length === 0 ? (
              <EmptyBundelState onAction={() => navigate("/app/createForm")} />
            ) : (
              <Fragment>
                <ui-title-bar title="Create Box">
                  <button variant="primary" onClick={() => navigate("/app/createBox")}>
                    Create New Bundel
                  </button>
                </ui-title-bar>
                <BundelsTable bundels={bundels} />
              </Fragment>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}