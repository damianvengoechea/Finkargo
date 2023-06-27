import { test, expect } from '@playwright/test';

//c) Verifica que el inicio de sesión sea exitoso y que el usuario sea redirigido a la página de productos
test('test login ok', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('input[id=\'user-name\']').fill('standard_user')
  await page.locator('input[id=\'password\']').fill('secret_sauce')
  await page.locator('[id=\'login-button\']').click()
  
  const loginOk = await page.locator('.title').innerText()

  expect(loginOk).toEqual('Products')
 
});

//escenarios alternos donde se verifica los mensajes correctos de fallo de inicio de sesion
test('test login fail user and password', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('input[id=\'user-name\']').fill('standard_user')
  await page.locator('input[id=\'password\']').fill('secret_sauc')
  await page.locator('[id=\'login-button\']').click()
  
  const errorMessage = await page.locator('//h3[@data-test=\'error\']').innerText()

  expect(errorMessage).toEqual('Epic sadface: Username and password do not match any user in this service')
});

//escenarios alternos donde se verifica los mensajes correctos de fallo de inicio de sesion
test('test login fields empty', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('input[id=\'user-name\']').fill('')
  await page.locator('input[id=\'password\']').fill('')
  await page.locator('[id=\'login-button\']').click()
  
  const errorMessage = await page.locator('//h3[@data-test=\'error\']').innerText()

  expect(errorMessage).toEqual('Epic sadface: Username is required')
 
});

//escenario de compra de producto
test('Comprar un Producto', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByRole('textbox', {name:'Username'}).fill('standard_user')
  await page.getByRole('textbox', {name:'Password'}).fill('secret_sauce')
  await page.getByRole('button', {name:'Login'}).click()

  // guardamos en una constante el nombre del articulo
  const nameProduct = await page.locator('#item_4_title_link').innerText()
  
  // f)Haz clic en el primer resultado de la búsqueda para abrir la página de detalles del producto
  await page.locator('#item_4_title_link').click()

  // g) Verifica que la página de detalles del producto se cargue correctamente verificamos que el boton add este visible
  await expect(page.getByRole('button', {name:'Add to cart'})).toBeVisible()
  
  // h) Haz clic en el botón "Agregar al carrito"
  await page.getByRole('button', {name:'Add to cart'}).click()

  const buttonRemove = await page.locator('#remove-sauce-labs-backpack').innerText()
  // i) Verifica que el producto se haya agregado correctamente al carrito
  await expect(buttonRemove).toEqual('Remove')


  // j) Navega al carrito  
  await page.locator('.shopping_cart_link').click()

  const nameProductCart = await page.locator('//div[@class=\'inventory_item_name\']').innerText()
  
  // verifica que el producto agregado aparezca en la lista del carrito
  expect(nameProduct).toEqual(nameProductCart)

  
 // k) Continúa con el proceso de compra simulando el llenado de información de envío y pago
  await page.getByRole('button', {name:'Checkout'}).click()

  await page.locator('#first-name').fill('Damian')
  await page.locator('#last-name').fill('Vengoechea')
  await page.locator('#postal-code').fill('05005')
  await page.getByRole('button', {name:'Continue'}).click()

  const totalPrice = await page.locator('//div[@class=\'summary_info_label summary_total_label\']').innerText()
  
  // l) Verifica que la orden de compra sea realizada correctament
  expect (totalPrice).toEqual('Total: $32.39')
  
  await page.getByRole('button', {name:'Finish'}).click()

  const resultFinish = await page.locator('.complete-header').innerText()

  // Verificar que muestre un mensaje de confirmación
  expect (resultFinish).toEqual('Thank you for your order!')
 
});