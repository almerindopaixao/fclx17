import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import CheckIcon from "@mui/icons-material/Check";
import { Order, OrderStatus } from "../../../../models";
import { Total } from "../../../../components/Total";

const order: Order = {
  id: '1',
  total: 50,
  status: OrderStatus.PAID,
  items: [
    {
      id: 1,
      quantity: 5,
      price: 25,
      product: {
        id: '1',
        description: 'teste',
        name: 'Coca Cola',
        price: 5,
        category_id: '2',
        image_url: 'https://cdn-cosmos.bluesoft.com.br/products/7894900018370'
      },
    },
    {
      id: 2,
      quantity: 5,
      price: 25,
      product: {
        id: '1',
        description: 'teste',
        name: 'Coca Cola',
        price: 5,
        category_id: '2',
        image_url: 'https://cdn-cosmos.bluesoft.com.br/products/7894900018370'
      },
    },
  ],
  created_at: new Date().toISOString()
}

async function CheckoutSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CheckIcon sx={{ color: "success.main", mr: 2, fontSize: 150 }} />
            </Box>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Pedido realizado com sucesso!
            </Typography>
          </Box>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Typography variant="h4">Resumo do pedido</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Qtd.</TableCell>
                <TableCell>Preço</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, key) => {
                return (
                  <TableRow key={key}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3}>
                  <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Total total={order.total} />
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default CheckoutSuccessPage;