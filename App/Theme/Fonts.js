import { StyleSheet } from 'react-native'

const size = {
  h1: 27,
  h2: 22,
  h3: 17,
  h4: 12,
  title: 18,
  header: 16,
  body: 14,
  caption: 12,
  regular: 17,
  medium: 14,
}

export default StyleSheet.create({
  h1: {
    fontSize: size.h1,
  },
  h2: {
    fontSize: size.h2,
  },
  h3: {
    fontSize: size.h3,
  },
  h4: {
    fontSize: size.h4,
  },
  normal: {
    fontSize: size.regular,
  },
  caption: {
    fontSize: size.caption,
  }
})
