  document.addEventListener("DOMContentLoaded", () => {
  const Unsplash_Key = "x2Um5qs1RCoX2wFRreGF1qfIRIN_PEYmmqTD0gzucXU"

  const input = document.getElementById("searchInput")
  const button = document.getElementById("searchBtn")
  const gallery = document.getElementById("gallery")
  const preview = document.getElementById("preview")
  const previewImg = document.getElementById("previewImg")

  let currentQuery = ""
  let currentPage = 1
  const perPage = 15 // images per request

  // ===== SEARCH FUNCTION =====
  function searchImages(reset = true) {
    if (!currentQuery) return

    if (reset) {
      gallery.innerHTML = "Loading..."
      currentPage = 1
    }

    fetch(`https://api.unsplash.com/search/photos?query=${currentQuery}&page=${currentPage}&per_page=${perPage}`, {
      headers: { Authorization: `Client-ID ${Unsplash_Key}` }
    })
      .then(res => res.json())
      .then(data => {
        if (reset) gallery.innerHTML = ""
        if (!data.results || data.results.length === 0) {
          if (reset) gallery.innerHTML = "No images found 😕"
          return
        }

        data.results.forEach(photo => {
          const img = document.createElement("img")
          img.src = photo.urls.small
          img.style.cursor = "pointer"

          img.addEventListener("click", () => {
            previewImg.src = photo.urls.regular
            preview.classList.remove("hidden")
          })

          gallery.appendChild(img)
        })

        // Show Load More button if more pages exist
        if (currentPage < data.total_pages) {
          if (!document.getElementById("loadMoreBtn")) {
            const loadMoreBtn = document.createElement("button")
            loadMoreBtn.id = "loadMoreBtn"
            loadMoreBtn.textContent = "Load More"
            loadMoreBtn.style.display = "block"
            loadMoreBtn.style.margin = "20px auto"
            loadMoreBtn.style.padding = "10px 20px"
            loadMoreBtn.style.cursor = "pointer"

            loadMoreBtn.addEventListener("click", () => {
              currentPage++
              searchImages(false)
            })

            gallery.parentNode.appendChild(loadMoreBtn)
          }
        } else {
          const existingBtn = document.getElementById("loadMoreBtn")
          if (existingBtn) existingBtn.remove()
        }
      })
      .catch(err => {
        console.error(err)
        gallery.innerHTML = "Something went wrong 😬"
      })
  }

  // ===== BUTTON & ENTER KEY =====
  button.addEventListener("click", () => {
    currentQuery = input.value.trim()
    searchImages(true)
  })

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      button.click()
    }
  })

  // ===== MODAL =====
  preview.addEventListener("click", () => {
    preview.classList.add("hidden")
  })

  previewImg.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      preview.classList.add("hidden")
    }
  })
})
