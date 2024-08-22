//HTML'den gerekli elementleri al
const btn = document.getElementById("kisa");
const input = document.getElementById("original-link");
const shortLinkText = document.getElementById("short-link");
const kisaltilanlarDiv = document.getElementById("kisaltilanlar");

//Kısaltılan linkeleri saklamak için vir dizi tanımlandı. Localstorage'den veriyi al veya boş dizi oluştur.
let kisaltilanlar = JSON.parse(localStorage.getItem ("Kisaltilanlar")) || []

//Link kısaltma fonksiyonu
function shortLink(url){
    return fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    .then((response) => response.json)
    .then((data) =>( data.ok ? data.result.short_link : ""))
}

btn.addEventListener("click",() => {
    //Orijinal linki al
    const url = input.value

    //Orijinal linki kısaltma fonksiyonunu çağır
    shortLink(url)
    .then((shortLink) => {
        //Kısa link başarılı bir şekilde elde edildiyse
        if(shortLink)
        {
            //Kısa linki kısaltılanlar listesine ekle
            kisaltilanlar.push({originalLink: url, shortLink: shortLink})

            //Kısaltılan linkleri LocalStorage'a kaydet
            localStorage.setItem("kisaltilanlar", JSON.stringify(kisaltilanlar))
            showKisaltilanlar()

            input.value
        }
        else
        {
            //Kısa link alınamadıysa, hata mesajı gönder
            alert(
                "Link kısaltma işlemi başarsız oldu. Lütfen geçerli bir link giriniz."
            )
        }
    })
    .catch((err) => {
        //Kısaltma sırasında hata olursa , hata mesajı göster
        console.log("Hata oluştu: ", err)
        alert(
            "Link kısaltma işlemi başarsız oldu. Lütfen geçerli bir link giriniz."
        )
    })
})

function showKisaltilanlar(){
    //Kısaltılan linkleri temizlemeden önce temizle
    kisaltilanlarDiv.innerHTML = ""

    kisaltilanlar.forEach((link, index) => {
        const linkDiv = document.createElement("div")
        linkDiv.classList.add("kisaltilan-link")
        linkDiv.innerHTML = `
            <p class="link-text"> <a href=${link.shortLink} target="_blank">${link.shortLink}</a> </p>
            <i class="fa-solid fa-copyc icon" title="Kopyala" onclick="copyLink(${index})"></i>
            <i class="fa-solid fa-trash icon" title="Sil" onclick="deleteLink(${index})"></i>
        `
        kisaltilanlarDiv.appendChild(linkDiv)
    })
    kisaltilanlarDiv.style.opacity = 1
}

//Kısa linki kopyalan fonksiyon
function copyLink(index) {
    const shortLink = kisaltilanlar[index].shortLink

    //Kısa linki panoya kopyala 
    navigator.clipboard
    .writeText(shortLink)
    .then(() => {
        //Kopyalama başarılı olursa
        alert("Link kopyalandı : " + shortLink)
    })
    .catch((err) => {
        //Kopyalama sırasında hata olursa
        console.log("Kopyalama hatası : ", err)
        
    })
}

//Kısa linki silen fonksiyon
function deleteLink(index) {
    //İlgili kısa linki diziden siler
    kisaltilanlar.splice(index, 1)

    //Güncellenmiş kısaltılan linkerli LocalStorage'a kaydet
    localStorage.setItem("kisaltilmis" ,JSON.stringify(kisaltilanlar))

    showKisaltilanlar()
}

//Veriler yüklendikten sonra kısaltılan linkleri göster 
document.addEventListener('DOMContentLoaded', () => {
    showKisaltilanlar()
})