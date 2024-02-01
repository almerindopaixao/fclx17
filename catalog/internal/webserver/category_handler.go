package webserver

import (
	"encoding/json"
	"net/http"

	"github.com/almerindopaixao/fclx17/catalog/internal/entity"
	"github.com/almerindopaixao/fclx17/catalog/internal/service"
	"github.com/go-chi/chi/v5"
)

type WebCategoryHandler struct {
	categoryService *service.CategoryService
}

func NewWebCategoryHandler(categoryService *service.CategoryService) *WebCategoryHandler {
	return &WebCategoryHandler{categoryService: categoryService}
}

func (wch *WebCategoryHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := wch.categoryService.GetCategories()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(categories)
}

func (wch *WebCategoryHandler) GetCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}

	category, err := wch.categoryService.GetCategory(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(category)
}

func (wch *WebCategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var category entity.Category
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := wch.categoryService.CreateCategory(category.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
