import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import "../styles/Message.css";

const API_BASE_URL = "https://pizza-api-pj4j.onrender.com";
const API_URL = `${API_BASE_URL}/api/v1/pizzas`;

const PRODUCT_NAMES = [
  "Пепперони Фреш", "Четыре сыра", "Вегетарианская", "Барбекю с курицей",
  "Острая мексиканская", "Грибная с чесноком", "Томатная буррата", "Цыплёнок ранч",
  "Гавайская", "Мясной пир", "Средиземноморская", "Сырный цыплёнок",
  "Овощная гриль", "Охотничья", "Сладкая карамель", "Пикантная салями",
  "Деревенская", "Моцарелла и томаты", "Курица терияки", "Острая колбаска",
];

const PRODUCT_DESCRIPTIONS = [
  "Нежная моцарелла, свежие томаты и ароматный соус",
  "Сочная начинка, хрустящая корочка и много сыра",
  "Пикантные специи, запечённые овощи и фирменный соус",
  "Курица, душистые травы и румяная сырная корочка",
  "Сбалансированный вкус для большой компании",
];

const PIZZA_IMAGE_IDS = [
  "1594007654729-407eedc4be65",
  "1574071318508-1cdbab80d002",
  "1579751626657-72bc17010498",
  "1565299624946-b28f40a0ae38",
  "1513104890138-7c749659a591",
  "1571407970349-bc81e7e96d47",
  "1571997478779-2adcbbe9ab2f",
  "1604068549290-dea0e4a305ca",
  "1590947132387-155cc02f3212",
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createGeneratedProduct(name) {
  const isChicken = Math.random() > 0.58;
  const isSpicy = Math.random() > 0.62;
  const isVegetarian = !isChicken && Math.random() > 0.45;

  return {
    title: name,
    description: randomItem(PRODUCT_DESCRIPTIONS),
    price: 450 + Math.floor(Math.random() * 10) * 50,
    doughType: Math.random() > 0.35 ? "traditional" : "thin",
    canCustomise: Math.random() > 0.7,
    isNew: Math.random() > 0.65,
    isMeat: !isVegetarian && !isChicken && Math.random() > 0.35,
    isSpicy,
    isSweet: Math.random() > 0.9,
    isVegetarian,
    isChicken,
    hasCheeseSauce: Math.random() > 0.55,
    hasMozzarella: true,
    hasGarlic: Math.random() > 0.55,
    hasPickles: Math.random() > 0.75,
    hasRedOnion: Math.random() > 0.6,
    hasTomatoes: Math.random() > 0.4,
  };
}

async function getBlobHash(blob) {
  const buffer = await blob.arrayBuffer();
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 2166136261;
  for (const byte of new Uint8Array(buffer)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return `${hash >>> 0}-${blob.size}-${blob.type}`;
}

async function downloadUniquePizzaImage(title, usedHashes) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const imageId = PIZZA_IMAGE_IDS[Math.floor(Math.random() * PIZZA_IMAGE_IDS.length)];
    const crop = ["center", "top", "bottom", "left", "right"][attempt % 5];
    const url = `https://images.unsplash.com/photo-${imageId}?w=800&h=800&fit=crop&crop=${crop}&q=85&auto=format&v=${attempt}`;
    const response = await axios.get(url, { responseType: "blob" });
    const hash = await getBlobHash(response.data);

    if (!usedHashes.has(hash)) {
      return {
        file: new File([response.data], `${title}.jpg`, { type: "image/jpeg" }),
        hash,
      };
    }
  }

  throw new Error("Не удалось найти уникальное изображение");
}

function createGeneratedProducts(count) {
  const names = [...PRODUCT_NAMES].sort(() => Math.random() - 0.5).slice(0, count);
  return names.map((name, index) => ({
    ...createGeneratedProduct(name),
    imageUrl: PIZZA_IMAGE_IDS[index % PIZZA_IMAGE_IDS.length],
  }));
}

function Panel() {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const initialFormState = {
    title: "",
    description: "",
    price: "",
    doughType: "traditional",
    canCustomise: false,
    isNew: false,
    isMeat: false,
    isSpicy: false,
    isSweet: false,
    isVegetarian: false,
    isChicken: false,
    hasCheeseSauce: false,
    hasMozzarella: false,
    hasGarlic: false,
    hasPickles: false,
    hasRedOnion: false,
    hasTomatoes: false,
  };

  const [form, setForm] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      const payload = response.data;
      setProducts(Array.isArray(payload) ? payload : payload?.data ?? []);
    } catch (error) {
      console.error("Ошибка при загрузке пицц:", error);
      setMessage("Не удалось загрузить каталог товаров");
    }
  };

  useEffect(() => {
    let isMounted = true;

    axios.get(API_URL)
      .then((response) => {
        if (!isMounted) return;
        const payload = response.data;
        setProducts(Array.isArray(payload) ? payload : payload?.data ?? []);
        setIsFetching(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке пицц:", error);
        if (isMounted) {
          setMessage("Не удалось загрузить каталог товаров");
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Товар успешно удален!");
      fetchProducts();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      setMessage("Не удалось удалить товар");
    }
  };

  const handleDeleteAll = async () => {
    if (products.length === 0) {
      setMessage("В каталоге нет товаров для удаления");
      return;
    }

    if (!window.confirm(`Удалить все товары (${products.length})?`)) return;

    setMessage("");
    setIsLoading(true);

    try {
      const results = await Promise.allSettled(
        products.map((product) => axios.delete(`${API_URL}/${product.id}`))
      );
      const deletedCount = results.filter((result) => result.status === "fulfilled").length;
      const failedCount = results.length - deletedCount;

      await fetchProducts();
      setMessage(
        failedCount === 0
          ? `Удалено товаров: ${deletedCount}`
          : `Удалено товаров: ${deletedCount}. Не удалось удалить: ${failedCount}`
      );
    } catch (error) {
      console.error("Ошибка массового удаления:", error);
      setMessage("Не удалось удалить товары");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Пожалуйста, выберите файл картинки!");
      return;
    }

    // Сохраняем ссылку на форму ДО выполнения async/await
    const targetForm = e.currentTarget;

    setMessage("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", file);

      await axios.post(API_URL, formData);

      setMessage("Товар успешно добавлен!");
      setFile(null);
      setForm(initialFormState);

      // Безопасный сброс HTML-полей формы
      targetForm.reset();
      await fetchProducts();
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
      const detail = error.response?.data?.detail;
      setMessage(
        typeof detail === "string" 
          ? detail 
          : "Не удалось добавить товар"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setMessage("");
    setIsLoading(true);

    try {
      const generatedProducts = createGeneratedProducts(12);
      let savedHashes = [];
      try {
        const storedHashes = JSON.parse(localStorage.getItem("generatedPizzaImageHashes") || "[]");
        savedHashes = Array.isArray(storedHashes) ? storedHashes : [];
      } catch {
        savedHashes = [];
      }
      const usedHashes = new Set(savedHashes);
      let createdCount = 0;
      let failedCount = 0;

      for (const product of generatedProducts) {
        try {
        const formData = new FormData();
        const productData = { ...initialFormState, ...product };

        delete productData.imageUrl;

        Object.keys(productData).forEach((key) => {
          formData.append(key, productData[key]);
        });
        const image = await downloadUniquePizzaImage(product.title, usedHashes);
        formData.append("image", image.file);
        await axios.post(API_URL, formData);
        usedHashes.add(image.hash);
        createdCount += 1;
        } catch (error) {
          failedCount += 1;
          console.error(`Ошибка добавления ${product.title}:`, error);
        }
      }

      try {
        localStorage.setItem("generatedPizzaImageHashes", JSON.stringify([...usedHashes]));
      } catch {
        console.warn("Не удалось сохранить историю изображений");
      }

      setMessage(failedCount === 0
        ? `Автоматически добавлено товаров: ${createdCount}`
        : `Добавлено товаров: ${createdCount}. Не удалось: ${failedCount}`);
      await fetchProducts();
    } catch (error) {
      console.error("Ошибка автогенерации:", error);
      setMessage("Не удалось автоматически добавить товары");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (products.length > 0 && !window.confirm("Удалить текущие товары и создать новый каталог?")) return;

    setMessage("");
    setIsLoading(true);

    try {
      const deleteResults = await Promise.allSettled(
        products.map((product) => axios.delete(`${API_URL}/${product.id}`))
      );
      const deleteFailed = deleteResults.some((result) => result.status === "rejected");

      if (deleteFailed) {
        throw new Error("Не все старые товары удалось удалить");
      }

      const generatedProducts = createGeneratedProducts(12);
      const savedHashes = [];
      const usedHashes = new Set(savedHashes);
      let createdCount = 0;

      for (const product of generatedProducts) {
        const formData = new FormData();
        const productData = { ...initialFormState, ...product };
        delete productData.imageUrl;
        Object.keys(productData).forEach((key) => formData.append(key, productData[key]));
        const image = await downloadUniquePizzaImage(product.title, usedHashes);
        formData.append("image", image.file);
        await axios.post(API_URL, formData);
        usedHashes.add(image.hash);
        createdCount += 1;
      }

      localStorage.setItem("generatedPizzaImageHashes", JSON.stringify([...usedHashes]));
      setMessage(`Каталог обновлён. Добавлено товаров: ${createdCount}`);
      await fetchProducts();
    } catch (error) {
      console.error("Ошибка обновления каталога:", error);
      setMessage("Не удалось полностью обновить каталог");
      await fetchProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    return !query || `${product.title} ${product.description}`.toLowerCase().includes(query);
  });

  return (
    <main className="catalog-page">
      <div className="catalog-shell">
        <section className="catalog-hero">
          <div>
            <p className="catalog-kicker">Pizza studio / inventory</p>
            <h1 className="catalog-title">Каталог, который хочется открыть.</h1>
            <p className="catalog-lead">Добавляйте новые позиции, собирайте коллекцию и держите меню в порядке в одном месте.</p>
          </div>
          <div className="catalog-summary" aria-label="Статистика каталога">
            <div><strong>{products.length}</strong><span>Позиций</span></div>
            <div><strong>{filteredProducts.length}</strong><span>На экране</span></div>
          </div>
        </section>

      <div className="catalog-workspace">
      <form className="catalog-form" onSubmit={handleSubmit} style={styles.form}>
        <h2>Добавить новый товар</h2>

        <div style={styles.inputGroup}>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Пепперони Фреш"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Описание:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Пикантное пепперони, моцарелла..."
            rows="3"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Цена (₽):</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="490"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Выберите изображение:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Тип теста:</label>
          <select name="doughType" value={form.doughType} onChange={handleChange}>
            <option value="traditional">Традиционное</option>
            <option value="thin">Тонкое</option>
          </select>
        </div>

        <fieldset style={styles.fieldset}>
          <legend>Опции и категории (Boolean)</legend>
          <label><input type="checkbox" name="canCustomise" checked={form.canCustomise} onChange={handleChange} /> Можно собирать</label>
          <label><input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> Новинка</label>
          <label><input type="checkbox" name="isMeat" checked={form.isMeat} onChange={handleChange} /> Мясные</label>
          <label><input type="checkbox" name="isSpicy" checked={form.isSpicy} onChange={handleChange} /> Острые</label>
          <label><input type="checkbox" name="isSweet" checked={form.isSweet} onChange={handleChange} /> Сладкие</label>
          <label><input type="checkbox" name="isVegetarian" checked={form.isVegetarian} onChange={handleChange} /> Вегетарианские</label>
          <label><input type="checkbox" name="isChicken" checked={form.isChicken} onChange={handleChange} /> С курицей</label>
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend>Ингредиенты (Boolean)</legend>
          <label><input type="checkbox" name="hasCheeseSauce" checked={form.hasCheeseSauce} onChange={handleChange} /> Сырный соус</label>
          <label><input type="checkbox" name="hasMozzarella" checked={form.hasMozzarella} onChange={handleChange} /> Моцарелла</label>
          <label><input type="checkbox" name="hasGarlic" checked={form.hasGarlic} onChange={handleChange} /> Чеснок</label>
          <label><input type="checkbox" name="hasPickles" checked={form.hasPickles} onChange={handleChange} /> Солёные огурчики</label>
          <label><input type="checkbox" name="hasRedOnion" checked={form.hasRedOnion} onChange={handleChange} /> Красный лук</label>
          <label><input type="checkbox" name="hasTomatoes" checked={form.hasTomatoes} onChange={handleChange} /> Томаты</label>
        </fieldset>

        <button type="submit" disabled={isLoading} style={styles.submitBtn}>
          {isLoading ? "Загрузка..." : "Добавить товар"}
        </button>

        

      <div className="catalog-actions">
      <button type="button" disabled={isLoading} onClick={handleGenerate} style={styles.generateBtn}>
        {isLoading ? "Генерация..." : "Сгенерировать товары"}
      </button>

      <button type="button" disabled={isLoading} onClick={handleRegenerate} style={styles.regenerateBtn}>
        {isLoading ? "Обновление..." : "Очистить и сгенерировать заново"}
      </button>

      <button type="button" disabled={isLoading || products.length === 0} onClick={handleDeleteAll} style={styles.deleteAllBtn}>
        {isLoading ? "Удаление..." : "Удалить все товары"}
      </button>
      </div>
      </form>
      <section className="catalog-results">
      <div className="catalog-toolbar">
        <h2 className="catalog-section-title">Каталог товаров</h2>
        <input className="catalog-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти пиццу..." aria-label="Поиск товаров" />
      </div>
      {message && <p className="catalog-status" role="status">{message}</p>}
      {isFetching ? <div className="catalog-empty">Загружаем каталог...</div> : filteredProducts.length === 0 ? <div className="catalog-empty">По вашему запросу ничего не найдено.</div> : <div className="product-grid">
        {filteredProducts.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            imageUrl={getImageUrl(item.imageUrl)}
            onDelete={handleDelete}
            disabled={isLoading}
          />
        ))}
      </div>
      }
      </section>
      </div>
      </div>
    </main>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "500px",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldset: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
  },
  submitBtn: {
    padding: "12px",
    backgroundColor: "#ff6900",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  generateBtn: {
    marginTop: "12px",
    padding: "12px 18px",
    backgroundColor: "#fff0e6",
    color: "#d94f00",
    border: "1px solid #ff6900",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteAllBtn: {
    marginTop: "12px",
    marginLeft: "8px",
    padding: "12px 18px",
    backgroundColor: "#fff1f1",
    color: "#d9363e",
    border: "1px solid #ff4d4f",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  regenerateBtn: {
    marginTop: "12px",
    marginLeft: "8px",
    padding: "12px 18px",
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "1px solid #1f2937",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
    marginTop: "20px",
  },
};

export default Panel;