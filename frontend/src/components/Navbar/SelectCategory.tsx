"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Category } from "../../models";
import { useSearchParams, useRouter } from "next/navigation";
import { searchProducts } from "@/utils";

interface SelectCategoryProps {
  categories: Category[]
}

export function SelectCategory({ categories }: SelectCategoryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  return (
    <FormControl size="small" sx={{ width: 200 }}>
      <Select
        name="select-category"
        sx={{ backgroundColor: grey[400] }}
        value={searchParams.get("category_id") || '0'}
        onChange={(event) => {
          const search = searchParams.get('search')
          const category_id = event.target.value

          searchProducts(router, search, category_id)
        }}
      >
        <MenuItem value="0">Todas as categorias</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}