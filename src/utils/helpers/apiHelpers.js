export async function validateJSONData(req) {
  try {
    const body = await req.json(); // Försöker parsa JSON från request body
    return [false, body]; // Om det lyckas, returnerar den ingen felstatus och själva JSON-datan
  } catch (error) {
    return [true, null]; // Om det misslyckas, returnerar den felstatus och ingen data
  }
}

export function object404Respsonse(response, model = "") {
  return response.json({
      message: `${model} not found`
  }, {
      status: 404
  })
}

export function validateItemData(data) {
  const errors = [];

  // Kontrollera att name finns och är en sträng
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string.');
  }

  // Kontrollera att quantity finns, är ett nummer och är icke-negativt
  if (data.quantity === undefined || typeof data.quantity !== 'number' || data.quantity < 0) {
    errors.push('Quantity is required and must be a non-negative number.');
  }

  // Kontrollera att description är en sträng om den är tillgänglig (valfritt)
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string.');
  }

  // Returnera true (det finns fel) och en lista med fel om några finns, annars false och en tom lista
  return [errors.length > 0, errors];
}

export function validateUserData(data) {
  const errors = [];

  // Kontrollera att name finns och är en sträng
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string.');
  }

  // Kontrollera att email finns, är en sträng, och har ett giltigt format
  if (!data.email || typeof data.email !== 'string' || !validateEmailFormat(data.email)) {
    errors.push('A valid email is required.');
  }

  // Kontrollera att password finns och är en sträng
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  // Returnera true (det finns fel) och en lista med fel om några finns, annars false och en tom lista
  return [errors.length > 0, errors];
}

// Hjälpfunktion för att kontrollera e-postformat
function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
