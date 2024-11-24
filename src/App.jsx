import { useState } from 'react'

import './App.css'
import Top from './component/Top';




import { Grid, GridItem } from '@chakra-ui/react'
import Left from './component/Left'

function App() {


  return (
    <>
      <div style={{ backgroundColor: "yellow" }}>

        {/* <h1>React Mermaid Example</h1>*/}
        {/* <Mermaid id={"app0"} chart={lg.join('')} /> */}

        {/* <MermaidComponent id={"app1"} source={lg.join('')} /> */}
        {/* <Top /> */}
      </div>
      <Grid
        h='100vh'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(4, 1fr)'
        gap={4}
      >
        <GridItem rowSpan={1} colSpan={4} bg='gray.50'>
          <Top />
        </GridItem>
        <GridItem colSpan={1} bg='papayawhip' ><Left /></GridItem>
        <GridItem colSpan={4} bg='tomato' ></GridItem>
      </Grid>
    </>
  )
}

export default App
