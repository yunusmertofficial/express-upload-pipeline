# express-upload-pipeline

🚀 A developer-friendly, dynamic, and powerful file upload helper for Express + Multer.

**Designed not just to upload files, but to manage them intelligently — especially in systems where files are tied to data objects like books, users, or products.**

---

## 🎯 Purpose

The main goal of this package is to **make managing files easier** in forms that involve **metadata + files**, especially when:

- Files are uploaded **as part of an array**
- Each file is associated with additional fields like `id`, `title`, `price`, etc.
- You want to **map uploaded files to objects** (e.g. rows in a table or cards in a grid)
- You need to know **which file belongs to which item**

Instead of manually parsing field names like `bookUrls[2].title`, `bookUrls[2].file`, this package does it all — automatically.

---

## 📦 Installation

```bash
npm install express-upload-pipeline
```

---

## ✨ Features

✅ Automatically builds multer.fields() config  
✅ Handles both single and array-style field names  
✅ MIME type validation (fileFilter)  
✅ File size validation (custom middleware)  
✅ Auto-parsing of req.files + req.body into structured objects  
✅ Maps bookUrls[0].title, bookUrls[0].file into a single object

---

## 🧠 Real-world Use Case

A user uploads multiple books via a form like this:

```ts
formData.append("bookUrls[0].id", "123");
formData.append("bookUrls[0].title", "Book A");
formData.append("bookUrls[0].file", file1);

formData.append("bookUrls[1].id", "456");
formData.append("bookUrls[1].title", "Book B");
formData.append("bookUrls[1].file", file2);
```

With this package, you'll get:

```ts
req.parsedFiles = {
  bookUrls: [
    { id: "123", title: "Book A", file: <File> },
    { id: "456", title: "Book B", file: <File> }
  ]
}
```

You no longer need to manually parse field names or reconstruct arrays. It’s done for you.

---

## ⚙️ Usage

```ts
import { setupUploadPipeline } from "express-upload-pipeline";

const uploadPipeline = setupUploadPipeline([
  {
    name: "avatar",
    maxCount: 1,
    allowedTypes: ["image/jpeg", "image/png"],
    maxSizeMB: 2,
  },
  {
    name: "bookUrls",
    maxCount: 6,
    allowedTypes: ["image/jpeg"],
    maxSizeMB: 3,
  },
]);

app.post("/upload", ...uploadPipeline, (req, res) => {
  const { avatar, bookUrls } = (req as any).parsedFiles;

  res.json({
    avatarFile: avatar?.file?.originalname,
    uploadedBooks: bookUrls.map((book: any) => ({
      title: book.title,
      id: book.id,
      fileName: book.file?.originalname,
    })),
  });
});
```

---

## 📄 Configuration Type

```ts
type UploadFieldConfig = {
  name: string; // Field name (prefix, e.g. 'avatar', 'bookUrls')
  maxCount: number; // Max number of items (1 for single, >1 for array)
  allowedTypes: string[]; // Accepted MIME types (e.g. ['image/jpeg'])
  maxSizeMB?: number; // Optional: max file size in MB (default: 5)
};
```

---

## 📁 Frontend FormData Format

This package expects nested field names from FormData:

```ts
formData.append("avatar.id", "7");
formData.append("avatar.file", avatarFile);

formData.append("bookUrls[0].title", "Book A");
formData.append("bookUrls[0].price", "50");
formData.append("bookUrls[0].file", file1);
```

It will automatically parse and merge all fields per object.

---

## ✅ Perfect For

- Tabular file uploads with object relationships
- React Hook Form + FormData integration
- Dynamic fields + files per item
- Systems using file IDs and metadata
- Drag & drop reorderable file lists

---

## 🧪 Example Projects

Coming soon: Full-stack React + Express upload example repo.

---
