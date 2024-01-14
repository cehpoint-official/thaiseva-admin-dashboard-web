import { View, StyleSheet } from "@react-pdf/renderer";
import InvoiceTableHeader from "./InvoiceTableHeader";
import InvoiceTableRow from "./InvoiceTableRow";
import InvoiceTableBlankSpace from "./InvoiceTableBlankSpace";
import InvoiceTableFooter from "./InvoiceTableFooter";

const tableRowsCount = 3;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#122159",
    margin: "0 15px",
  },
});

const InvoiceItemsTable = ({ paymentTable }) => (
  <View style={styles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow paymentTable={paymentTable} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount} />
    <InvoiceTableFooter paymentTable={paymentTable} />
  </View>
);

export default InvoiceItemsTable;
