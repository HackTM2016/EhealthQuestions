package hacktm.pubmed

import java.util.UUID

import org.apache.http.impl.client.SystemDefaultHttpClient
import org.apache.solr.client.solrj.impl.CloudSolrClient
import org.apache.solr.common.SolrInputDocument
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.SQLContext
import org.apache.spark.{SparkConf, SparkContext}

import scala.collection.JavaConverters._


object SolrPubmedArticleFeeder extends App {
  // The expected number of arguments
  val NoOfArgs = 3

  if (args.length != NoOfArgs) {
    println
      s"""
        Expected $NoOfArgs arguments:
        - zkhost (host:port)
        - Solr collection name
        - input path to articles folder with parquet files
      """.stripMargin

    sys.exit(1)
  }

  // The maximum size of the batch for writing Solr docs
  val SolrDocsBatchSize: Int = 1000

  //
  val (zookeeperHost, solrCollection, inputPath) = (args(0), args(1), args(2))

  // Create the spark context
  val conf = new SparkConf().setAppName(getClass.getSimpleName)
  val sc = new SparkContext(conf)
  val sqlContext = SQLContext.getOrCreate(sc)

  // Read the articles from the input path
  val articles = sqlContext.read.parquet(inputPath)

  // Transform each article in Solr document
  val articlesSolrDoc: RDD[SolrInputDocument] = articles.map(article => {
    val document = new SolrInputDocument()
    article.schema.fieldNames.foreach(fieldName => document.addField(fieldName, article.getAs(fieldName)))
    document.setField("id", UUID.randomUUID().toString)
    document
  })

  // Write the articles documents to Solr
  articlesSolrDoc.foreachPartition(documents => {
    // TODO: Replace this deprecated class
    val httpClient = new SystemDefaultHttpClient()
    val solrClient = new CloudSolrClient(zookeeperHost, httpClient)
    solrClient.setDefaultCollection(solrCollection)
    documents.grouped(SolrDocsBatchSize).foreach(batch => {
      solrClient.add(batch.asJava)
      solrClient.commit()
    })
  })
}
