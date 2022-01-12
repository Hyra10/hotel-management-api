export const errorList = {
  notFound: (obj: string) =>
    `${obj} no existe`,
  notAuthenticated: 'No esta autenticado',
  wrongCredentials: 'La contraseña o el email son incorrectos',
  alreadyExists: (obj: string) => `${obj} ya existe por favor use otro`,
}