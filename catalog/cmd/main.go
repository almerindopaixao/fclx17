package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/almerindopaixao/fclx17/catalog/internal/database"
	"github.com/almerindopaixao/fclx17/catalog/internal/service"
	"github.com/almerindopaixao/fclx17/catalog/internal/webserver"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	port := "8080"
	db, err := sql.Open("mysql", "root:root@tcp(catalog_db:3306)/catalog")

	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	categoryDB := database.NewCategoryDB(db)
	categoryService := service.NewCategoryService(*categoryDB)

	productDB := database.NewProductDB(db)
	productService := service.NewProductService(*productDB)

	webCategoryHandler := webserver.NewWebCategoryHandler(categoryService)
	WebProductHandler := webserver.NewWebProductHandler(productService)

	c := chi.NewRouter()
	c.Use(middleware.Logger)
	c.Use(middleware.Recoverer)
	c.Get("/category/{id}", webCategoryHandler.GetCategory)
	c.Get("/category", webCategoryHandler.GetCategories)
	c.Post("/category", webCategoryHandler.CreateCategory)

	c.Get("/product/{id}", WebProductHandler.GetProduct)
	c.Get("/product", WebProductHandler.GetProducts)
	c.Get("/product/category/{categoryID}", WebProductHandler.GetProductsByCategoryID)
	c.Post("/product", WebProductHandler.CreateProduct)

	fmt.Printf("Server is running on port %s\n", port)
	http.ListenAndServe(fmt.Sprintf(":%s", port), c)
}
