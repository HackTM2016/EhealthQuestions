class ProxyController < ApplicationController
  def index
    rsp = get_articles('?q=body : cancer&wt=json&indent=true')
    rsp = JSON.parse(rsp)

    respond_to do |format|

      format.json do
        response.headers['Access-Control-Allow-Origin'] = '*'
        render :json => rsp
      end
    end
  end

  def get_articles(query)
    uri = URI("http://hacktm.ness.ro:8983/solr/article/select#{query}")
    Net::HTTP.get(uri)
  end
end
