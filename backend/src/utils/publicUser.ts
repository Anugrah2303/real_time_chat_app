import { IUser } from '../interfaces/user'

const publicUser = (u: IUser) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  profileImage: u.profileImage
})

export default publicUser
