import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/evm-utils'
dotenv.config()
const MORALIS_API_KEY = process.env.MORALIS_API_KEY
const moralis = Moralis.default
const chain = EvmChain.FUJI
const app = express()
const port = 8080

const fetchData = async (typeData) => {
  let response
  switch (typeData) {
    case 'graphInformation':
      response = await axios.get(
        'http://ec2-34-207-93-96.compute-1.amazonaws.com:8088/last_data/?token=0ce956fc-131b-42d6-a4b1-8e8319e45f84'
      )
      return response.data
    case 'counter':
      response = await axios.get(
        'http://ec2-34-207-93-96.compute-1.amazonaws.com:8088/query_drop/?token=0ce956fc-131b-42d6-a4b1-8e8319e45f84'
      )
      return response.data
    case 'redeem':
      response = await axios.get(
        'http://ec2-34-207-93-96.compute-1.amazonaws.com:8088/claim_drop/?token=0ce956fc-131b-42d6-a4b1-8e8319e45f84&user=user2'
      )
      return response.data
    default:
      return []
  }
}

app.use(cors())
app.use(express.json())

app.get('/lastest', async (req, res) => {
  const data = await fetchData('graphInformation')
  res.set('Access-Control-Allow-Origin', '*')
  res.send(data)
})

app.get('/counter', async (req, res) => {
  const data = await fetchData('counter')
  res.send({ data })
})

app.get('/redeem', async (req, res) => {
  const data = await fetchData('redeem')
  res.send({ data })
})

app.get('/allNFTs', async (req, res) => {
  const { query } = req
  const wallet = query.wallet

  const response = await moralis.EvmApi.nft.getNFTOwners({
    address: query.address,
    chain: chain
  })
  const result = response.raw
  const NFTs = result.result
  const NFTsByOwer = (wallet) => {
    const NFTsOwner = []
    NFTs.map((NFT) => {
      if (NFT.owner_of === wallet.toLocaleLowerCase()) {
        NFTsOwner.push(NFT)
      }
    })
    return NFTsOwner
  }

  res.set('Access-Control-Allow-Origin', '*')
  res.send(NFTsByOwer(wallet))
})

moralis
  .start({
    apiKey: MORALIS_API_KEY
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port} 🎈`)
    })
  })
