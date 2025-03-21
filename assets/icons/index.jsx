import { View, Text } from 'react-native'
import React from 'react'
import Home from './Home'
import AddImage from './AddImage'
import { theme } from '../../constants/theme'

const icons = {
    home: Home,
    addImage: AddImage
}

const Icon = ({name, ...props}) => {
const IconComponent = icons[name]
    return (
   <IconComponent height={props.size||24} width={props.size||24}
   strokeWidth={props.strokeWidth || 1.9}
   color={theme.colors.textLight}
   {...props}
   />
  )
}

export default Icon